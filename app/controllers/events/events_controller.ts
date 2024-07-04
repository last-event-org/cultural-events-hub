import env from '#start/env'
import { DateTime } from 'luxon'
import fs from 'fs'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine, { errors } from '@vinejs/vine'

import Event from '#models/event'
import Category from '#models/category'
import CategoryType from '#models/category_type'
import Address from '#models/address'
import Price from '#models/price'
import Media from '#models/media'
import Indicator from '#models/indicator'
import User from '#models/user'
import AddressesController from '#controllers/addresses_controller'

import { createEventValidator } from '#validators/event'
import { createAddressValidator } from '#validators/address'
import { createMediaValidator } from '#validators/media'
import { createPricesValidator } from '#validators/price'
import { queryValidator } from '#validators/query'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const requestQuery = request.qs()
    let events
    let title: string | null = ''
    let categories: any[] = []
    let dayBegin: string
    let dayEnd: string
    let categoryName: string
    let categoryTypeName: string

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      events = await Event.query()
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
        categoryName = category?.name
        categories = await category?.related('categoryTypes').query()
        categories?.forEach((categoryType) => {
          categoryTypesId.push(categoryType.$attributes.id)
        })
        title = 'Vos events pour ' + category?.name
      } else if (requestQuery['category-type']) {
        const categoryTypeId = await CategoryType.find(requestQuery['category-type'])
        categoryTypeName = categoryTypeId?.name
        const category = await Category.find(categoryTypeId?.categoryId)
        categoryName = category?.name
        categoryTypesId.push(categoryTypeId?.id ?? 1)
        title = 'Vos events pour ' + category?.name + ' / ' + categoryTypeId?.name
      }
      if (requestQuery['date']) {
        // TODO verify if the date is in the correct format
        let date = DateTime.fromISO(requestQuery['date'])

        dayBegin = date.toSQL() ?? ''
        dayEnd = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
        events = await Event.query()
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
      } else {
        events = await Event.query()
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
        categoryName: categoryName,
        categoryTypeName: categoryTypeName,
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
      return view.render('pages/events/location', {
        // events: events,
        title: title,
        city: requestQuery['city'],
      })
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

      title = 'Event sur ' + requestQuery['city']
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

  async search({ request, response, view }: HttpContext) {
    // TODO define beginDate today
    const qs = request.qs()
    console.log(qs)
    let payload
    try {
      payload = await request.validateUsing(queryValidator)
      console.log(payload)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        console.log(error.messages)
      }
    }

    let [latitude, longitude] = [0, 0]
    let ids: any
    let radius = 15
    let [dayBegin, dayEnd]: any = [0, 0]
    let dateTitle

    console.log('IFFFSSSS')

    if (qs.city) {
      console.log('CITYYYY')
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/geocode/search/structured?api_key=${env.get('API_KEY_ROUTERSERVICE')}&country=belgium&locality=${payload.city}&boundary.country=BE`
        )
        const datas = await res.json()
        if (datas) {
          ;[latitude, longitude] = [
            datas.features[0].geometry.coordinates[1],
            datas.features[0].geometry.coordinates[0],
          ]
        }
        if (qs.radius) {
          radius = payload.radius
        }
        ids = await this.findEventsIDByLocation(latitude, longitude, radius)
      } catch (error) {
        console.log(error)
        response.redirect().back()
      }
    }

    if (qs.date) {
      console.log('DATE   ' + qs.date)
      ;[dayBegin, dayEnd] = await this.formatDate(payload.date)
      let date = new Date(dayBegin).toISOString()
      dateTitle = DateTime.fromISO(date)
    }

    const events = await Event.query()
      .if(qs.city, (query) => query.whereIn('id', ids))
      .if(qs.date, (query) => query.whereBetween('event_start', [dayBegin, dayEnd]))
      .if(!qs.date, (query) => query.where('event_start', '>=', new Date().toISOString()))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')
    console.log(events)

    return view.render('pages/events/list', {
      events: events,
      location: payload.city,
      date: dateTitle?.toLocaleString({ day: 'numeric', month: 'long' }),
    })
  }

  async formatDate(dateQuery: any) {
    let isoDate = new Date(dateQuery).toISOString()
    let date = DateTime.fromISO(isoDate)
    let dayBegin: string = date.toSQL() ?? ''
    let dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
    return [dayBegin, dayEnd]
  }

  async findEventsIDByLocation(lat: number | null, long: number | null, radius: number | null) {
    const eventsId = await db.rawQuery(`
    SELECT e.id
    FROM events e
    JOIN addresses l ON e.location_id = l.id
    WHERE ST_Distance_Sphere(
        POINT(l.longitude, l.latitude), 
        POINT(${long}, ${lat})
    ) <= ${radius ? radius * 1000 : 15 * 1000}
  `)
    // Radius in meters

    let ids: any = []
    eventsId[0].forEach((element: any) => {
      ids.push(element.id)
    })

    return ids
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
    address.street = addressPayload.street.replace('&#x27;', "'")
    address.number = addressPayload.number
    address.zipCode = addressPayload.zip_code
    address.city = addressPayload.city
    address.country = addressPayload.country
    try {
      const [latitude, longitude] = await this.getCoordinatesFromAddress(
        address.city,
        address.street,
        address.zipCode,
        address.number
      )
      address.latitude = latitude
      address.longitude = longitude
    } catch (error) { }

    await address.save()
    await event.related('location').associate(address)
  }

  async getCoordinatesFromAddress(city: string, street: string, zip: number, number: string) {
    console.log('getCoordinatesFromAddress')
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search/structured?api_key=${env.get('API_KEY_ROUTERSERVICE')}&address=${street} ${number}&postalcode=${zip}&locality=${city}&boundary.country=BE`
      )
      const datas = await response.json()
      console.log(datas)
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

    let isUserFavourite = false
    let isInUserWishlist = false

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
        .first()

      // If the User is authenticated
      if (event) {
        const user = auth.user
        if (user) {
          // we check if the Vendor is already on user favourites
          const userFavourites = await user
            .related('favouritesUser')
            .query()
            .where('vendor_id', event.vendorId)

          isUserFavourite = userFavourites.length > 0

          // we check if the event is already on user wishlist
          const alreadyWishlisted = await event
            .related('usersWhoWishlisted')
            .query()
            .where('user_id', user.id)
            .first()

          if (alreadyWishlisted) isInUserWishlist = true
        }
      }

      if (!event) {
        response.redirect().back()
      } else {
        session.forget('item-added')
        return view.render('pages/events/details', {
          event: event,
          isUserFavourite: isUserFavourite,
          isInUserWishlist: isInUserWishlist,
        })
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
  async update({ i18n, params, request, session, response }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)
    // const event = await Event.findOrFail(params['id'])
    const event = await Event.query()
      .where('id', '=', params['id'])
      .preload('location')
      .first()
    console.log('\n\n\n\n\n', event?.location.name)

    if (event) {

      event.title = payload.title
      event.subtitle = payload.subtitle
      event.description = payload.description

      // TODO practical data (address)


      // Date
      event.eventStart = DateTime.fromISO(payload.event_start)
      event.eventEnd = DateTime.fromISO(payload.event_end)
      if (event.eventStart > event.eventEnd) {
        const errorMsg = i18n.t('messages.errorEventDates')
        session.flash('errorEventDates', errorMsg)
        return response.redirect().back()
      }

      // Links (allow empty links)
      if (payload.facebook_link && payload.facebook_link != '') {
        event.facebookLink = payload.facebook_link
      } else {
        event.facebookLink = ''
      }
      if (payload.instagram_link && payload.instagram_link != '') {
        event.instagramLink = payload.instagram_link
      } else {
        event.instagramLink = ''
      }
      if (payload.website_link && payload.website_link != '') {
        event.websiteLink = payload.website_link
      } else {
        event.websiteLink = ''
      }
      // TODO: build the embed youtube url from the normal url
      if (payload.youtube_link && payload.youtube_link != '') {
        event.youtubeLink = payload.youtube_link
      } else {
        event.youtubeLink = ''
      }

      // TODO categories
      // TODO subcategories
      // TODO indicators
      // TODO prices

      await event.save()
    }
    return response.redirect().toRoute('events.show', { id: params.id })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}
