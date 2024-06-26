import { HttpContext } from '@adonisjs/core/http'
import { createEventValidator } from '#validators/event'
import Event from '#models/event'
import { DateTime } from 'luxon'
import Category from '#models/category'
import CategoryType from '#models/category_type'
import { createAddressValidator } from '#validators/address'
import Address from '#models/address'
import Price from '#models/price'
import { createMediaValidator } from '#validators/media'
import Media from '#models/media'
import AddressesController from '#controllers/addresses_controller'
import fs from 'fs'
import Indicator from '#models/indicator'
import { createPricesValidator } from '#validators/price'
import User from '#models/user'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view, auth }: HttpContext) {
    await auth.check()
    const requestQuery = request.qs()
    let events
    let title: string | null = ''
    let categories: any[] = []
    let dayBegin: string
    let dayEnd: string

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      events = await await Event.query()
        .preload('location')
        .preload('categoryTypes', (categoryTypesQuery) => {
          categoryTypesQuery.preload('category')
        })
        .preload('indicators')
        .preload('prices')
        .preload('media')
        .orderBy('event_start', 'desc')

      title = 'Agenda complet'
      return view.render('pages/events/list', { events: events, title: title })
    }
    // get events by one category or category-type and date - OK
    // TODO validate data if no category or category-type
    // TODO preload datas as in home
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

        dayBegin = date.toSQL() ?? ''
        dayEnd = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
        events = await await Event.query()
          .whereHas('categoryTypes', (query) => {
            query.whereInPivot('category_type_id', categoryTypesId)
          })
          .whereBetween('event_start', [dayBegin, dayEnd])
          .preload('location')
          .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category')
          })
          .preload('indicators')
          .preload('prices')
          .preload('media')
          .orderBy('event_start', 'asc')
        title += ' le ' + date.setLocale('fr').toFormat('dd-MM-yyyy')
      } else {
        events = await await Event.query()
          .whereHas('categoryTypes', (query) => {
            query.whereInPivot('category_type_id', categoryTypesId)
          })
          .preload('location')
          .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category')
          })
          .preload('indicators')
          .preload('prices')
          .preload('media')
          .orderBy('event_start', 'asc')
      }

      // console.log(events.length)

      return view.render('pages/events/list', {
        events: events,
        title: title,
        categories: categories,
      })
    }

    // get events by one locationID (i.e. le forum) - OK
    // TODO validation if location do not exist
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
            .preload('location')
            .preload('categoryTypes', (categoryTypesQuery) => {
              categoryTypesQuery.preload('category')
            })
            .preload('indicators')
            .preload('prices')
            .preload('media')
            .orderBy('event_start', 'asc')
          title = 'Events pour une location'
          return view.render('pages/events/list', { events: events, title: title })
        }
      }
    }

    // get events based on one specifc date - OK
    // TODO validation if date not in correct format
    if (requestQuery['date']) {
      console.log('DATE')
      let date = DateTime.fromISO(requestQuery['date'])

      dayBegin: string = date.toSQL() ?? ''
      dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
      events = await Event.query().whereBetween('event_start', [dayBegin, dayEnd])
      title = date.setLocale('fr').toFormat('dd-MM-yyyy')
      return view.render('pages/events/list', { events: events, title: title })
    }

    // get events by one vendorID - OK
    // TODO validation if vendor do not exist
    if (requestQuery['vendor']) {
      events = await Event.query()
        .where('vendor_id', requestQuery['vendor'])
        .orderBy('event_start', 'asc')
        .preload('location')
        .preload('categoryTypes', (categoryTypesQuery) => {
          categoryTypesQuery.preload('category')
        })
        .preload('indicators')
        .preload('prices')
        .preload('media')
        .orderBy('event_start', 'asc')
      title = 'Event pour un vendeur'

      return view.render('pages/events/list', { events: events, title: title })
    }

    if (requestQuery['city']) {
      let [events, title] = await this.citySearch(request)
      return view.render('pages/events/list', { events: events, title: title })
    }

    // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()
    const indicators = await Indicator.all()

    return view.render('pages/events/add-event', {
      categories: categories,
      categoryTypes: categoryTypes,
      indicators: indicators,
    })
  }

  async citySearch(request: HttpContext['request']) {
    const requestQuery = request.qs()
    let events
    let title: string | null = ''

    // TODO validation if city do not exist
    if (requestQuery['city']) {
      events = await Event.query()
        .orderBy('event_start', 'asc')
        .preload('location')
        .preload('categoryTypes', (categoryTypesQuery) => {
          categoryTypesQuery.preload('category')
        })
        .preload('indicators')
        .preload('prices')
        .preload('media')
        .orderBy('event_start', 'asc')
      title = 'Event pour un endroit' + requestQuery['city']
    }

    return [events, title]
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, session, response, auth }: HttpContext) {
    const event = await this.createEvent(request, session, response)
    if (event) {
      const user = auth.user
      if (user) event.vendorId = user.id
      await this.attachCategoryTypes(request, session, event)
      await this.attachIndicators(request, event)
      await this.createEventAddress(request, event)
      await this.createEventPrices(request, event)
      await this.uploadEventMedia(request, event)

      return response.redirect().toRoute('events.show', { id: event.id })
    }
  }

  async createEvent(
    request: HttpContext['request'],
    session: HttpContext['session'],
    response: HttpContext['response']
  ) {
    // try {
    const payload = await request.validateUsing(createEventValidator)

    const event = new Event()

    event.title = payload.title
    event.subtitle = payload.subtitle
    event.description = payload.description
    event.eventStart = DateTime.fromISO(payload.event_start)
    event.eventEnd = DateTime.fromISO(payload.event_end)
    if (event.eventStart > event.eventEnd) {
      session.flash('date', {
        message: "La début de l'événement doit être avant la fin",
      })
    }
    if (payload.facebook_link) event.facebookLink = payload.facebook_link
    if (payload.instagram_link) event.instagramLink = payload.instagram_link
    if (payload.website_link) event.websiteLink = payload.website_link
    if (payload.youtube_link) event.youtubeLink = payload.youtube_link

    return await event.save()

    // } catch (error) {
    // console.error('Event Validation Error at createEventPrices():', error);
    // }
  }

  async attachCategoryTypes(
    request: HttpContext['request'],
    session: HttpContext['session'],
    event: Event
  ) {
    const selectedCategoryTypes = request.body().categoryTypes

    if (selectedCategoryTypes) {
      selectedCategoryTypes.forEach(async (categoryTypeId: number) => {
        await event.related('categoryTypes').attach([categoryTypeId])
      })
    } else {
      console.log('NOK************')
      // session.flash('category', 'NOK************')
    }
  }

  async attachIndicators(request: HttpContext['request'], event: Event) {
    const selectedIndicators = request.body().indicators
    if (selectedIndicators) {
      selectedIndicators.forEach(async (indicatorId: number) => {
        await event.related('indicators').attach([indicatorId])
      })
    }
  }

  async createEventPrices(request: HttpContext['request'], event: Event) {
    // try {
    const pricePayloads = await request.validateUsing(createPricesValidator)

    for (const pricePayload of pricePayloads.prices) {
      const price = new Price()

      if (pricePayload.price_description) price.description = pricePayload.price_description
      if (pricePayload.regular_price) price.regularPrice = pricePayload.regular_price
      if (pricePayload.discounted_price) price.discountedPrice = pricePayload.discounted_price
      if (pricePayload.available_qty) price.availableQty = pricePayload.available_qty

      await price.save()
      await price.related('event').associate(event)
    }
    // } catch (error) {
    // console.error('Price Validation Error at createEventPrices():', error)
    // }
  }

  async createEventAddress(request: HttpContext['request'], event: Event) {
    const addressPayload = await request.validateUsing(createAddressValidator)
    const address = new Address()

    address.name = addressPayload.name ?? ''
    address.street = addressPayload.street
    address.number = addressPayload.number
    address.zipCode = addressPayload.zip_code
    address.city = addressPayload.city
    address.country = addressPayload.country
    const [latitude, longitude] = await this.getCoordinatesFromAddress(
      addressPayload.city,
      addressPayload.street,
      addressPayload.zip_code,
      addressPayload.number
    )
    address.latitude = latitude
    address.longitude = longitude

    await address.save()
    await event.related('location').associate(address)
  }

  async getCoordinatesFromAddress(city: string, street: string, zip: number, number: string) {
    console.log('getCoordinatesFromAddress')
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search/structured?api_key=${process.env.API_KEY_ROUTERSERVICE}&address=${street} ${number}&postalcode=${zip}&locality=${city}&boundary.country=BE`
      )
      const datas = await response.json()
      return [datas.features[0].geometry.coordinates[1], datas.features[0].geometry.coordinates[0]]
    } catch (e) {
      console.log('ERROR')
      console.log(e)
    }
    // lat: data.features[0].geometry.coordinates[1],
    // lng: data.features[0].geometry.coordinates[0],
  }

  async uploadEventMedia(request: HttpContext['request'], event: Event) {
    const { images_link } = await request.validateUsing(createMediaValidator)

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
        console.error('Media binary upload error:', error)
      }
    }
  }

  /**
   * Show individual record
   */
  async show({ view, params, session, response, auth }: HttpContext) {
    await auth.check()
    try {
      const event = await Event.query()
        .where('id', '=', params.id)
        .preload('location')
        .preload('categoryTypes', (categoryTypesQuery) => {
          categoryTypesQuery.preload('category')
        })
        .preload('indicators')
        .preload('prices')
        .preload('media')
        .preload('vendor')

      if (event === undefined || event.length === 0) {
        response.redirect().back()
      } else {
        session.forget('item-added')
        return view.render('pages/events/details', { event: event[0] })
      }
    } catch (error) {
      if (error) {
        console.error('Price Validation Error at createEventPrices():', error)
        response.redirect().back()
      }
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()
    const indicators = await Indicator.all()

    const event = await Event.query()
      .where('id', '=', params.id)
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')

    return view.render('pages/events/edit-event', {
      event: event[0],
      categories: categories,
      categoryTypes: categoryTypes,
      indicators: indicators,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)
    const event = await Event.findOrFail(params['id'])
    console.log(event)

    event.title = payload.title
    event.subtitle = payload.subtitle
    event.description = payload.description
    // event.eventStart = DateTime.fromISO(payload.event_start)
    // event.eventEnd = DateTime.fromISO(payload.event_end)
    // if (event.eventStart > event.eventEnd) {
    //   session.flash('date', {
    //     message: "La début de l'événement doit être avant la fin",
    //   })
    // }
    if (payload.facebook_link) event.facebookLink = payload.facebook_link
    if (payload.instagram_link) event.instagramLink = payload.instagram_link
    if (payload.website_link) event.websiteLink = payload.website_link
    if (payload.youtube_link) event.youtubeLink = payload.youtube_link

    await event.save()
    return response.redirect().toRoute('events.show', { id: params.id })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
