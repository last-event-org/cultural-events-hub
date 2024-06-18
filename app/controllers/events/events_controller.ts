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

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const requestQuery = request.qs()
    // const locationId = query['location']
    // const indicatorId = query['indicator']

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      const events = await Event.all()
      return view.render('pages/events/list', { events: events })
    }

    // Get events by category_type_id
    // const categoryTypeId = await CategoryType.find(requestQuery['category-type'])
    // const events = await categoryTypeId?.related('events').query()

    // Get events by category_id
    const categoryId = await Category.find(1)
    const categories = categoryId?.related('categoryTypes').query()
    // console.log(categories)

    // console.log(categoryId)
    // const events = categoryId?.related('categoryTypesEvents').query()

    // console.log(events)
    // const categoryTypes = await CategoryType.query().where('parentCategoryId', 1)
    // console.log(categoryTypes)

    // const events = await categoryTypeId?.related('categoryTypesEvents').query()

    // const location = 'liege'
    // const event = new Event()
    // await event.getEventsByLocation(location)
    const events = await Event.all()
    return view.render('pages/events/list', { events: events })
    // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()

    // console.log(categoryTypes)
    return view.render('pages/events/add-event', {
      categories: categories,
      categoryTypes: categoryTypes,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    // console.log(request.body())
    // console.log(request.body().title)
    // console.log(request.all())

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

    await event.save()

    // Event Category Types
    const selectedCategoryTypes = request.body().categoryTypes

    selectedCategoryTypes.forEach(async (categoryTypeId: number) => {
      await event.related('categoryTypes').attach([categoryTypeId])
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
    console.log('mediaPayload: ', images_link);
    
    for (const file of images_link) {
      const media = new Media()
      media.path = ''  // TODO if needed, setup a path method if we'll use an external server
      media.altName = file.clientName
      media.eventId = event.id

      if (!file.tmpPath) {
        console.error('Skipping file due to missing tmpPath:', file);
        continue; // Skip this iteration if tmpPath is undefined
      }

      try {
        const binaryData = fs.readFileSync(file.tmpPath)
        media.binary = binaryData
        await media.save()
      } catch (error) {
        console.error(`Failed to process file ${file.tmpPath}:`, error);
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
