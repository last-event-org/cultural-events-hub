import type { HttpContext } from '@adonisjs/core/http'
import { createEventValidator } from '#validators/event'
import Event from '#models/event'
import { DateTime } from 'luxon'
import Category from '#models/category'
import CategoryType from '#models/category_type'

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
    console.log(categories)

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

    const selectedCategoryTypes = request.body().categoryTypes

    selectedCategoryTypes.forEach(async (categoryTypeId: number) => {
      await event.related('categoryTypes').attach([categoryTypeId])
    })

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
