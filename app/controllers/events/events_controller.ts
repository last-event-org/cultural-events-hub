import type { HttpContext } from '@adonisjs/core/http'
import { createEventValidator } from '#validators/event'
import Event from '#models/event'
import { DateTime } from 'luxon'
import Category from '#models/category'
import CategoryType from '#models/category_type'
import { createAddressValidator } from '#validators/address'
import Address from '#models/address'
import { createPriceValidator } from '#validators/price'
import Price from '#models/price'
import { createMediaValidator } from '#validators/media'
import Media from '#models/media'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import fs from 'fs'
import Indicator from '#models/indicator'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const requestQuery = request.qs()
    let events
    let title: string | null = ''
    let categories: any[] = []

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      events = await Event.query().orderBy('event_start', 'asc')
      title = 'Agenda complet'
      return view.render('pages/events/list', { events: events, title: title })
    }
    // get events by one category or category-type and date - OK
    if (requestQuery['category'] || requestQuery['category-type']) {
      let categoryTypesId: any[] = []

      if (requestQuery['category']) {
        const category = await Category.find(requestQuery['category'])
        categories = await category?.related('categoryTypes').query()
        categories?.forEach((categoryType) => {
          categoryTypesId.push(categoryType.$attributes.id)
        })
        title = 'Vos events pour ' + category?.name
      } else if (requestQuery['category-type']) {
        const categoryTypeId = await CategoryType.find(requestQuery['category-type'])
        const category = await Category.find(categoryTypeId?.categoryId)
        categoryTypesId.push(categoryTypeId?.id ?? 1)
        title = 'Vos events pour ' + category?.name + ' / ' + categoryTypeId?.name
      }
      if (requestQuery['date']) {
        // TODO verify if the date is in the correct format
        let date = DateTime.fromISO(requestQuery['date'])

        const dayBegin: string = date.toSQL() ?? ''
        const dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
        events = await Event.query()
          .whereBetween('event_start', [dayBegin, dayEnd])
          .andWhereHas('categoryTypes', (query) => {
            query.whereInPivot('category_type_id', categoryTypesId).orderBy('event_start', 'asc')
          })
        title += ' le ' + date.setLocale('fr').toFormat('dd-MM-yyyy')
      } else {
        events = await Event.query().whereHas('categoryTypes', (query) => {
          query.whereInPivot('category_type_id', categoryTypesId).orderBy('event_start', 'asc')
        })
      }
    }

    // get events by one locationID (i.e. le forum) - OK
    if (requestQuery['location']) {
      const location = await Address.find(requestQuery['location'])
      if (requestQuery['date']) {
        console.log(requestQuery['date'])
      } else {
        if (location !== undefined) {
          title = 'Vos événements à ' + location?.name
          events = await Event.query()
            .where('location_id', requestQuery['location'])
            .orderBy('event_start', 'asc')
        }
      }
    }

    // get events based on one specifc date - OK
    if (requestQuery['date']) {
      console.log('DATE')
      let date = DateTime.fromISO(requestQuery['date'])

      const dayBegin: string = date.toSQL() ?? ''
      const dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
      events = await Event.query().whereBetween('event_start', [dayBegin, dayEnd])
      title = date.setLocale('fr').toFormat('dd-MM-yyyy')
      return view.render('pages/events/list', { events: events, title: title })
    }

    // get events by one vendorID - OK
    if (requestQuery['vendor']) {
      events = await Event.query()
        .where('vendor_id', requestQuery['vendor'])
        .orderBy('event_start', 'asc')
    }

    return view.render('pages/events/list', {
      events: events,
      title: title,
      categories: categories,
    })
    // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()
    const indicators = await Indicator.all()

    // console.log(categoryTypes)
    return view.render('pages/events/add-event', {
      categories: categories,
      categoryTypes: categoryTypes,
      indicators: indicators,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {  // TODO reformat this method in different do-one-thing methods

    const payload = await request.validateUsing(createEventValidator)

    const event = new Event()

    event.title = payload.title
    event.subtitle = payload.subtitle
    event.description = payload.description
    event.eventStart = DateTime.fromISO(payload.event_start)
    event.eventEnd = DateTime.fromISO(payload.event_end)
    event.facebookLink = payload.facebook_link
    event.instagramLink = payload.instagram_link
    event.websiteLink = payload.website_link
    event.youtubeLink = payload.youtube_link

    await event.save()

    // Event Category Types
    const selectedCategoryTypes = request.body().categoryTypes
    selectedCategoryTypes.forEach(async (categoryTypeId: number) => {
      await event.related('categoryTypes').attach([categoryTypeId])
    })

    // Event Indicators
    const selectedIndicators = request.body().indicators
    selectedIndicators.forEach(async (indicatorId: number) => {
      await event.related('indicators').attach([indicatorId])
    })

    // Event Address
    const addressPayload = await request.validateUsing(createAddressValidator)
    const address = new Address()

    address.name = addressPayload.name
    address.street = addressPayload.street
    address.number = addressPayload.number
    address.zipCode = addressPayload.zip_code
    address.city = addressPayload.city
    address.country = addressPayload.country

    await address.save()
    await event.related('location').associate(address)

    // Event Prices
    const pricePayload = await request.validateUsing(createPriceValidator)
    const price = new Price()

    price.description = pricePayload.price_description
    price.regularPrice = pricePayload.regular_price
    price.discountedPrice = pricePayload.discounted_price
    price.availableQty = pricePayload.available_qty

    await price.save()
    await price.related('event').associate(event)

    // Event Media
    const { images_link } = await request.validateUsing(createMediaValidator)
    console.log('mediaPayload: ', images_link)

    for (const file of images_link) {
      const media = new Media()
      media.path = '' // TODO if needed, setup a path method if we'll use an external server
      media.altName = file.clientName
      media.eventId = event.id

      if (!file.tmpPath) {
        console.error('Skipping file due to missing tmpPath:', file)
        continue // Skip this iteration if tmpPath is undefined
      }

      try {
        const binaryData = fs.readFileSync(file.tmpPath)
        media.binary = binaryData
        await media.save()
      } catch (error) {
        console.error(`Failed to process file ${file.tmpPath}:`, error)
      }
    }

    return response.redirect().toRoute('events.show', { id: event.id })
  }

  /**
   * Show individual record
   */
  async show({ view, params, request }: HttpContext) {
    // console.log(request.params())
    // console.log(params)
    return view.render('pages/events/details')
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
