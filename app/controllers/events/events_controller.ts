import type { HttpContext } from '@adonisjs/core/http'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    console.log(request.params())
    console.log(request.qs())
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