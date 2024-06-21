import { createRegisterValidator } from '#validators/register'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'

export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
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
      session.flash('password', 'Password do not match')
      response.redirect().back()
    }

    const user = new User()

    user.firstname = payload.first_name
    user.lastname = payload.last_name
    user.email = payload.email
    user.password = payload.password

    const role = await Role.findBy('role_name', 'USER')
    if (role) {
      user.roleId = role.id
    }
    // await user.related('role').associate(role)

    await user.save()
    if (user.$isPersisted) {
      await auth.use('web').login(user)
      // return response.redirect('/')
      return response.redirect().toRoute('auth.register.profile-type')
    } else {
      return response.redirect().back()
    }
  }

  async profileType({ view }: HttpContext) {
    return view.render('pages/auth/profile-type')
  }

  async updateProfileType({ session, request, response, auth }: HttpContext) {}

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
