import { createRegisterValidator } from '#validators/register'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/register')
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ session, request, response }: HttpContext) {
    const payload = await request.validateUsing(createRegisterValidator)
    if (request.input('password') !== request.input('password_confirmation')) {
      console.log('password error')
      session.flash('password', 'Password do not match')
      response.redirect().back()
    }
    console.log(payload)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

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
