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

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const requestQuery = request.qs()
    let events
    // const locationId = query['location']
    // const indicatorId = query['indicator']

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      events = await Event.query().orderBy('event_start', 'asc')
      return view.render('pages/events/list', { events: events })
    }

    // Get events by category_type_id - CA FONCTIONNE OK
    if (requestQuery['category-type']) {
      const categoryTypeId = await CategoryType.find(requestQuery['category-type'])
      events = await categoryTypeId?.related('events').query().orderBy('event_start', 'asc')
    }

    // get events by one category - NOK
    if (requestQuery['category']) {
      const categoryId = await Category.find(1)
      const categories = categoryId?.related('categoryTypes')
      console.log(categories)

      events = await Event.query().whereHas('categoryTypes', (query) => {
        query.whereInPivot('category_type_id', [25, 28]).orderBy('event_start', 'asc')
      })
      // console.log(events.forEach((event) => console.log('EVENT' + event)))
    }

    // get events by one locationID (i.e. le forum) - OK
    if (requestQuery['location']) {
      events = await Event.query()
        .where('location_id', requestQuery['location'])
        .orderBy('event_start', 'asc')
    }

    // get events by one vendorID - OK
    if (requestQuery['vendor']) {
      events = await Event.query()
        .where('vendor_id', requestQuery['vendor'])
        .orderBy('event_start', 'asc')
    }

    return view.render('pages/events/list', { events: events })
    // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    const categoryTypes = await CategoryType.all()

    console.log(categoryTypes)
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

    return response.redirect().toRoute('events.show', { id: event.id })
  }

  /**
   * Show individual record
   */
  async show({ view, params, request }: HttpContext) {
    console.log(request.params())
    console.log(params)
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
