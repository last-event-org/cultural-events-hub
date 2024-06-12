import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    console.log(request.params())
    const query = request.qs()
    console.log(query)

    // Check if there is no params in the query
    if (Object.keys(request.qs()).length === 0) {
      const eventList = await Event.all()
      console.log(eventList)
      return view.render('pages/events/list')
    }

    const location = 'liege'
    const event = new Event()
    await event.getEventsByLocation(location)
    // http://localhost:3333/events/?location=liege&category=5&sub-category=25&begin=25-12-2024&end=31-12-2024&indicators=5
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, request }: HttpContext) {
    console.log(request.params())
    console.log(params)
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
