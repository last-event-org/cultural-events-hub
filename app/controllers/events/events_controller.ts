import env from '#start/env'
import { DateTime } from 'luxon'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { errors } from '@vinejs/vine'

import Event from '#models/event'
import Category from '#models/category'
import CategoryType from '#models/category_type'
import Address from '#models/address'
import Price from '#models/price'
import Media from '#models/media'
import Indicator from '#models/indicator'

import { createEventValidator } from '#validators/event'
import { createAddressValidator } from '#validators/address'
import { createMediaValidator } from '#validators/media'
import { queryValidator } from '#validators/query'
import { createPriceValidator } from '#validators/create_price'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class EventsController {
  /**
   * Display events on the home page. All events within 7 days and for which there are available tickets
   * @returns events, categories, topEvents and todayEvents
   */
  async home({ view, auth, i18n }: HttpContext) {
    // await auth.check()
    const categories = await Category.query().select('name', 'slug', 'id')

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    const events = await Event.query()
      .andWhereBetween('event_start', [dayBegin, dayEnd])
      .andWhereHas('prices', (query) => query.where('available_qty', '>', 0))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media', (mediaQuery) => {
        mediaQuery.select('path', 'altName')
      })
      .orderBy('event_start', 'asc')

    const [topEvents, nextEvents, title] = await this.getFeaturedEvents(i18n)

    return view.render('pages/events/list', {
      categories: categories,
      events: events,
      topEvents: topEvents,
      todayEvents: nextEvents,
      title: 'home',
      nextTitle: title,
      filter: true,
    })
  }

  /**
   * Display a list of resource
   */
  async index({ view, i18n }: HttpContext) {
    // get all events up to now

    const categories = await Category.all()

    const events = await Event.query()
      .where('event_start', '>=', new Date().toISOString())
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')

    const [topEvents, nextEvents, title] = await this.getFeaturedEvents(i18n)

    return view.render('pages/events/list', {
      events: events,
      categories: categories,
      topEvents: topEvents,
      todayEvents: nextEvents,
      title: 'agenda',
      nextTitle: title,
      filter: true,
    })
  }

  // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5

  async tickets({ view, i18n }: HttpContext) {
    const categories = await Category.all()
    // get all events with tickets up to now
    const events = await Event.query()
      .andWhere('event_start', '>=', new Date().toISOString())
      .andWhereHas('prices', (query) => query.where('available_qty', '>', 0))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media', (mediaQuery) => {
        mediaQuery.select('path', 'altName')
      })
      .orderBy('event_start', 'asc')

    const [topEvents, nextEvents, title] = await this.getFeaturedEvents(i18n)

    return view.render('pages/events/list', {
      events: events,
      categories: categories,
      topEvents: topEvents,
      todayEvents: nextEvents,
      title: 'tickets',
      nextTitle: title,
      filter: true,
    })
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

  /**
   * Handle form submission for the create action
   */
  async store({ request, session, response, i18n, auth }: HttpContext) {
    const event = await this.createEvent(request, session)
    if (event) {
      const user = auth.user
      if (user) event.vendorId = user.id
      if (!(await this.attachCategoryTypes(request, session, i18n, event)))
        return response.redirect().back()
      await this.attachIndicators(request, event)
      await this.createEventAddress(request, event)
      if (!(await this.createEventPrices(request, session, response, i18n, event)))
        return response.redirect().back()
      await this.uploadEventMedia(request, event)

      return response.redirect().toRoute('events.show', { id: event.id })
    }
  }

  async search({ request, response, view, i18n }: HttpContext) {
    const qs = request.qs()
    let payload
    let [latitude, longitude] = [50.645138, 5.57342]
    let ids: any
    let radius: any = 15
    let [dayBegin, dayEnd]: any = [0, 0]
    let dateTitle
    let categoryTypeName: string | undefined
    let category: any
    let vendorName: string | undefined | null
    let locationName: string | undefined
    let categoryTypesId: any[] = []
    let categoryTypes: any
    let filter = true

    const categories = await Category.query().select('name', 'slug', 'id')

    try {
      payload = await request.validateUsing(queryValidator)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      response.redirect().back()
    }

    if (qs.city) {
      try {
        ;[latitude, longitude] = await this.getCoordinatesFromCity(payload?.city)

        if (qs.radius) {
          radius = payload?.radius
        }
        ids = await this.findEventsIDByLocation(latitude, longitude, radius)
      } catch (error) {
        response.redirect().back()
      }
      filter = true
    }

    if (qs.date) {
      ;[dayBegin, dayEnd] = await this.formatDate(payload?.date)
      let date = new Date(dayBegin).toISOString()
      dateTitle = DateTime.fromISO(date)
    }

    if (qs.location) {
      const location = await Address.query().select('name').where('id', qs.location).first()
      locationName = location?.name
      filter = false
    }

    if (qs.vendor) {
      const vendor = await User.query().select('company_name').where('id', qs.vendor).first()
      vendorName = vendor?.companyName
      filter = false
    }

    if (qs.categoryType) {
      const categoryTypeId = await CategoryType.find(qs.categoryType)
      categoryTypeName = categoryTypeId?.name
      category = await categoryTypeId
        ?.related('category')
        .query()
        .select('name', 'id', 'slug')
        .preload('categoryTypes')
        .first()
      console.log(category)
      categoryTypes = category?.categoryTypes
      categoryTypesId = [qs.categoryType]
    } else if (qs.category) {
      category = await Category.find(qs.category)
      categoryTypes = await category?.related('categoryTypes').query()
      categoryTypes?.forEach((categoryType: any) => {
        categoryTypesId.push(categoryType.$attributes.id)
      })
      filter = true
    }
    const events = await Event.query()
      .if(qs.city, (query) => query.whereIn('id', ids))
      .if(qs.vendor, (query) => query.where('vendor_id', qs.vendor))
      .if(qs.location, (query) => query.where('location_id', qs.location))
      .if(qs.date, (query) => query.whereBetween('event_start', [dayBegin, dayEnd]))
      .if(categoryTypesId.length > 0, (query) =>
        query.whereHas('categoryTypes', (categoryTypeQuery) => {
          categoryTypeQuery.whereInPivot('category_type_id', categoryTypesId)
        })
      )
      .if(!qs.date, (query) => query.where('event_start', '>=', new Date().toISOString()))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')

    const [topEvents, nextEvents, title] = await this.getFeaturedEvents(i18n)
    console.log('\n\nFILTER\n\n')
    console.log(filter)

    return view.render('pages/events/list', {
      events: events.length === 0 ? null : events,
      city: payload?.city ?? null,
      date: dateTitle?.toLocaleString({ day: 'numeric', month: 'long' }) ?? null,
      category: category ?? null,
      categoryType: categoryTypeName ?? null,
      vendor: vendorName ?? null,
      location: locationName ?? null,
      categoryTypes: categoryTypes ?? null,
      categories: categories,
      latitude: latitude,
      longitude: longitude,
      topEvents: topEvents,
      todayEvents: nextEvents,
      nextTitle: title,
      filter: filter,
    })
  }

  async getEventsByWord({ request, view, response }: HttpContext) {
    let events: Event[] = []
    const input = request.qs()

    if (input.input_words) {
      const wordsArray = input.input_words.split(' ')

      for (const word of wordsArray) {
        const results = await Event.query()
          .preload('location')
          .preload('vendor')
          .preload('media')
          .preload('prices')
          .preload('indicators')
          .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category')
          })
          .where((event) => {
            event
              .whereILike('title', `%${word}%`)
              .orWhereILike('subtitle', `%${word}%`)
              .orWhereILike('description', `%${word}%`)
          })
          .orWhereHas('vendor', (vendor) => {
            vendor.whereILike('companyName', `%${word}%`)
          })
          .orWhereHas('location', (vendor) => {
            vendor
              .whereILike('name', `%${word}%`)
              .orWhereILike('street', `%${word}%`)
              .orWhereILike('city', `%${word}%`)
          })
          .distinct()

        // Merge results into events array
        events = [...events, ...results]
      }
      return view.render('pages/events/list', {
        events: events.length === 0 ? null : events,
      })
    }
    return response.redirect().toRoute('home')
  }

  async formatDate(dateQuery: any) {
    let isoDate = new Date(dateQuery).toISOString()
    let date = DateTime.fromISO(isoDate)
    let dayBegin: string = date.toSQL() ?? ''
    let dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
    return [dayBegin, dayEnd]
  }

  async findEventsIDByLocation(lat: number, long: number, radius: number) {
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

  async createEvent(request: HttpContext['request'], session: HttpContext['session']) {
    const payload = await request.validateUsing(createEventValidator)

    const event = new Event()

    event.title = payload.title.replaceAll('&#x27;', "'")
    event.subtitle = payload.subtitle.replaceAll('&#x27;', "'")
    event.description = payload.description.replaceAll('&#x27;', "'")
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
    if (payload.youtube_link && payload.youtube_link != '') {
      event.youtubeLink = this.generateYoutubeEmbedLink(payload.youtube_link)
    } else {
      event.youtubeLink = ''
    }

    return await event.save()
  }

  async attachCategoryTypes(
    request: HttpContext['request'],
    session: HttpContext['session'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const selectedCategoryTypes = request.body().categoryTypes

    if (selectedCategoryTypes) {
      selectedCategoryTypes.forEach(async (categoryTypeId: number) => {
        await event.related('categoryTypes').attach([categoryTypeId])
      })
    } else {
      const errorMsg = i18n.t('messages.errorMissingCategType')
      session.flash('errorMissingCategType', errorMsg)
      return false
    }
    return true
  }

  async attachIndicators(request: HttpContext['request'], event: Event) {
    const selectedIndicators = request.body().indicators
    if (selectedIndicators) {
      selectedIndicators.forEach(async (indicatorId: number) => {
        await event.related('indicators').attach([indicatorId])
      })
    }
  }

  async createEventPrices(
    request: HttpContext['request'],
    session: HttpContext['session'],
    response: HttpContext['response'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const bodyPrices = request.body().prices

    if (bodyPrices) {
      // we process one price element at a time
      bodyPrices.forEach(async (priceData: any) => {
        try {
          const payload = await createPriceValidator.validate(priceData)

          if (payload) {
            const price = new Price()
            if (payload.price_description) price.description = payload.price_description
            if (payload.regular_price) price.regularPrice = payload.regular_price
            if (payload.discounted_price) price.discountedPrice = payload.discounted_price
            if (payload.available_qty) price.availableQty = payload.available_qty

            await price.save()
            await price.related('event').associate(event)
          }
        } catch (error) {
          let errorMsg = i18n.t('messages.errorCreatePrice') + ' '
          error.messages.forEach((msg: string) => {
            errorMsg += msg
          })
          session.flash('errorCreatePrice', errorMsg)
          return false
        }
      })
      return true
    } else {
      // TODO this error message is not displayed when no prices are entered (payload empty)
      const errorMsg = i18n.t('messages.errorMissingPrices') + ' '
      session.flash('errorMissingPrices', errorMsg)
    }
    return false
  }

  async createEventAddress(request: HttpContext['request'], event: Event) {
    const addressPayload = await request.validateUsing(createAddressValidator)
    const address = new Address()

    address.name = addressPayload.name ?? ''
    address.street = addressPayload.street.replaceAll('&#x27;', "'")
    address.number = addressPayload.number
    address.zipCode = addressPayload.zip_code
    address.city = addressPayload.city
    address.country = addressPayload.country
    try {
      const [latitude, longitude]: any = await this.getCoordinatesFromAddress(
        address.city,
        address.street,
        address.zipCode,
        address.number
      )
      address.latitude = latitude
      address.longitude = longitude
    } catch (error) {}

    await address.save()
    await event.related('location').associate(address)
  }

  async getCoordinatesFromCity(city: string) {
    console.log('getCoordinatesFromCity')
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search/structured?api_key=${env.get('API_KEY_ROUTERSERVICE')}&country=belgium&locality=${city}&boundary.country=BE`
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
      const uniqueFileName = `${cuid()}.${file.extname}`
      await file.move(app.publicPath('uploads/'), {
        name: uniqueFileName,
      })
      media.path = `/uploads/${uniqueFileName}`
      media.altName = file.clientName
      media.eventId = event.id

      await media.save()
    }
  }

  async updateEventMedia(
    request: HttpContext['request'],
    session: HttpContext['session'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const mediaUpdateDetection = request.__raw_files.images_link
    const mediaUpdateLength = mediaUpdateDetection ? Object.keys(mediaUpdateDetection).length : null

    if (mediaUpdateLength != null && mediaUpdateLength > 0) {
      const { images_link } = await request.validateUsing(createMediaValidator)
      try {
        for (const file of images_link) {
          const media = new Media()
          const uniqueFileName = `${cuid()}.${file.extname}`
          await file.move(app.publicPath('uploads/'), {
            name: uniqueFileName,
          })
          media.path = `/uploads/${uniqueFileName}`
          media.altName = file.clientName
          media.eventId = event.id

          await media.save()
        }
      } catch (error) {
        const errorMsg = i18n.t('messages.errorEditingMedia') + ' ' + error
        session.flash('errorEditingMedia', errorMsg)
        return false
      }
    }
    return true
  }

  async deleteEventMedia({ params, response, session, i18n }: HttpContext) {
    const media = await Media.find(params['id'])
    if (media) {
      try {
        await media.delete()
      } catch (error) {
        console.log(error)
        const errorMsg = i18n.t('messages.errorDestroyEvent')
        session.flash('error', errorMsg)
      }
      response.redirect().back()
    }
  }

  async getTodayEvents() {
    // get 5 events that occur today

    const dayBegin = DateTime.now().toSQLDate()
    let dayEnd: string = DateTime.now().set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''

    const events = await Event.query()
      .select('id', 'location_id', 'title')
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location', (locationQuery) => locationQuery.select('id', 'name', 'city'))
      .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
      .orderBy('event_start', 'asc')
      .limit(5)

    return events
  }

  async getNextEvents() {
    // get 5 events that occur today

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    const events = await Event.query()
      .select('id', 'location_id', 'title')
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location', (locationQuery) => locationQuery.select('id', 'name', 'city'))
      .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
      .orderBy('event_start', 'asc')
      .limit(5)

    return events
  }

  async getTopEvents() {
    // get 5 events in the next 7 days

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    const events = await Event.query()
      .select('id', 'location_id', 'title')
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location', (locationQuery) => locationQuery.select('id', 'name', 'city'))
      .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
      .limit(5)

    return events
  }

  async getFeaturedEvents(i18n: HttpContext['i18n']) {
    const topEvents = await this.getTopEvents()
    let nextEvents = await this.getTodayEvents()
    let title = i18n.t('messages.events_today')
    if (nextEvents.length === 0) {
      nextEvents = await this.getNextEvents()
      title = i18n.t('messages.events_next')
    }
    return [topEvents, nextEvents, title]
  }

  /**
   * Show individual record
   */
  async show({ view, params, session, response, auth }: HttpContext) {
    await auth.check()

    let isUserFavourite = false
    let isInUserWishlist = false
    let linkedEvents

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

        linkedEvents = await Event.query()
          .select('location_id', 'id', 'title', 'event_start', 'event_end')
          .preload('location', (locationQuery) => locationQuery.select('name', 'city'))
          .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery
              .preload('category', (categoryQuery) => {
                categoryQuery.where('id', event.categoryTypes[0].category.id).select('id')
              })
              .select('id', 'category_id')
          })
          .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
          .limit(5)

        console.log('\n\n LINKEDEVENTS \n\n')
        console.log(linkedEvents)
      }

      if (!event) {
        response.redirect().back()
      } else {
        session.forget('item-added')
        return view.render('pages/events/details', {
          event: event,
          linkedEvents: linkedEvents,
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
  async edit({ params, view, auth }: HttpContext) {
    await auth.check()
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()
    const indicators = await Indicator.all()
    const media = await Media.query().where('event_id', '=', params.id)

    const event = await Event.query()
      .where('id', '=', params.id)
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')

    return view.render('pages/events/edit-event', {
      event: event[0],
      categories: categories,
      categoryTypes: categoryTypes,
      indicators: indicators,
      media: media,
      mediaLength: media.length,
    })
  }

  async updateEventAddress(
    request: HttpContext['request'],
    session: HttpContext['session'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const addressPayload = await request.validateUsing(createAddressValidator)
    if (addressPayload) {
      event.location.name = addressPayload.name ?? ''
      event.location.street = addressPayload.street.replace('&#x27;', "'")
      event.location.number = addressPayload.number
      event.location.zipCode = addressPayload.zip_code
      event.location.city = addressPayload.city
      event.location.country = addressPayload.country

      try {
        const [latitude, longitude]: any = await this.getCoordinatesFromAddress(
          event.location.city,
          event.location.street,
          event.location.zipCode,
          event.location.number
        )
        event.location.latitude = latitude
        event.location.longitude = longitude
      } catch (error) {}

      await event.location.save()
      return true
    }
    return false
  }

  async updateEventCategoryTypes(
    request: HttpContext['request'],
    session: HttpContext['session'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const selectedCategoryTypes = request.body().categoryTypes

    if (selectedCategoryTypes) {
      // attach new sub-categories selected
      // without re-attaching old ones otherwise we get a SQL error
      const eventCategTypes: number[] = []
      event.categoryTypes.forEach(async (categType: CategoryType) => {
        eventCategTypes.push(categType.id)
      })
      selectedCategoryTypes.forEach(async (categ: number) => {
        if (!eventCategTypes.includes(Number(categ))) {
          await event.related('categoryTypes').attach([categ])
        }
      })

      // detach sub-categories that have been removed from the event
      event.categoryTypes.forEach(async (categType: CategoryType) => {
        if (!selectedCategoryTypes.includes(String(categType.id))) {
          await event.related('categoryTypes').detach([categType.id])
        }
      })
    } else {
      const errorMsg = i18n.t('messages.errorMissingCategType')
      session.flash('errorMissingCategType', errorMsg)
      return false
    }
    return true
  }

  async updateEventIndicators(request: HttpContext['request'], event: Event) {
    const selectedIndicators = request.body().indicators

    // attach new indicators selected
    // without re-attaching old ones otherwise we get a SQL error
    if (selectedIndicators) {
      const eventIndicators: number[] = []
      event.indicators.forEach(async (indicator: Indicator) => {
        eventIndicators.push(indicator.id)
      })
      selectedIndicators.forEach(async (indicatorId: number) => {
        if (!eventIndicators.includes(Number(indicatorId))) {
          await event.related('indicators').attach([indicatorId])
        }
      })
    } else {
      // detach indicators that have been removed from the event
      event.indicators.forEach(async (indicator: Indicator) => {
        await event.related('indicators').detach([indicator.id])
      })
    }
    // No error handling here because indicators are not required
  }

  async updateEventPrices(
    request: HttpContext['request'],
    session: HttpContext['session'],
    i18n: HttpContext['i18n'],
    event: Event
  ) {
    const bodyPrices = request.body().prices

    if (bodyPrices) {
      // we delete all existing prices associated with current event
      const prices = event.prices
      prices.forEach((price: Price) => {
        price.delete()
      })

      // we process one price element at a time
      bodyPrices.forEach(async (priceData: any) => {
        try {
          const payload = await createPriceValidator.validate(priceData)

          if (payload) {
            const price = new Price()
            if (payload.price_description) price.description = payload.price_description
            if (payload.regular_price) price.regularPrice = payload.regular_price
            if (payload.discounted_price) price.discountedPrice = payload.discounted_price
            if (payload.available_qty) price.availableQty = payload.available_qty

            await price.save()
            await price.related('event').associate(event)
          }
        } catch (error) {
          let errorMsg = i18n.t('messages.errorCreatePrice') + ' '
          error.messages.forEach((msg: string) => {
            errorMsg += msg
          })
          session.flash('errorCreatePrice', errorMsg)
          return false
        }
      })
      return true
    } else {
      // TODO this error message is not displayed when no prices are entered (payload empty)
      const errorMsg = i18n.t('messages.errorMissingPrices') + ' '
      session.flash('errorMissingPrices', errorMsg)
    }
    return false
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ i18n, params, request, session, response }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)

    const event = await Event.query()
      .where('id', '=', params['id'])
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .first()

    if (event) {
      event.title = payload.title.replaceAll('&#x27;', "'")
      event.subtitle = payload.subtitle.replaceAll('&#x27;', "'")
      event.description = payload.description.replaceAll('&#x27;', "'")

      // Date
      event.eventStart = DateTime.fromISO(payload.event_start)
      event.eventEnd = DateTime.fromISO(payload.event_end)
      if (event.eventStart > event.eventEnd) {
        const errorMsg = i18n.t('messages.errorEventDates')
        session.flash('errorEventDates', errorMsg)
        return response.redirect().back()
      }

      // Links (allow empty links)
      if (payload.facebook_link && payload.facebook_link !== '') {
        event.facebookLink = payload.facebook_link
      } else {
        event.facebookLink = ''
      }
      if (payload.instagram_link && payload.instagram_link !== '') {
        event.instagramLink = payload.instagram_link
      } else {
        event.instagramLink = ''
      }
      if (payload.website_link && payload.website_link !== '') {
        event.websiteLink = payload.website_link
      } else {
        event.websiteLink = ''
      }

      if (payload.youtube_link && payload.youtube_link != '') {
        event.youtubeLink = this.generateYoutubeEmbedLink(payload.youtube_link)
      } else {
        event.youtubeLink = ''
      }

      if (!(await this.updateEventAddress(request, session, i18n, event)))
        return response.redirect().back()
      if (!(await this.updateEventCategoryTypes(request, session, i18n, event)))
        return response.redirect().back()
      await this.updateEventIndicators(request, event) // Indicators are optional
      if (!(await this.updateEventPrices(request, session, i18n, event)))
        return response.redirect().back()
      if (!(await this.updateEventMedia(request, session, i18n, event)))
        return response.redirect().back()

      await event.save()
    }
    return response.redirect().toRoute('events.show', { id: params.id })
  }

  getYoutubeVideoId(youtubeLink: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = youtubeLink.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  generateYoutubeEmbedLink(youtubeLink: string) {
    const videoId = this.getYoutubeVideoId(youtubeLink)
    const embedLink = 'https://www.youtube.com/embed/' + videoId
    return embedLink
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session, i18n }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)
      await event.delete()
    } catch (error) {
      console.log(error)
      const errorMsg = i18n.t('messages.errorDestroyEvent')
      session.flash('error', errorMsg)
      return response.redirect().back()
    }
    const successMsg = i18n.t('messages.successDestroyEvent')
    session.flash('success', successMsg)
    return response.redirect().toRoute('auth.vendor.events')
  }
}
