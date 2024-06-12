import { createRegisterValidator } from '#validators/register'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import Role from '#models/role'

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
  async store({ session, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createRegisterValidator)
    if (request.input('password') !== request.input('password_confirmation')) {
      console.log('password error')
      session.flash('password', 'Password do not match')
      response.redirect().back()
    }

    const hashedPassword = await hash.make('password')
    const user = new User()

    user.firstname = payload.first_name
    user.lastname = payload.last_name
    user.email = payload.email
    user.password = hashedPassword

    // TODO check null is not assignable
    const role = await Role.findBy('role_name', 'USER')
    await user.related('role').associate(role)

    await user.save()
    if (user.$isPersisted) {
      await auth.use('web').login(user)
      return response.redirect('/')
    } else {
      return response.redirect().back()
    }
  }

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
