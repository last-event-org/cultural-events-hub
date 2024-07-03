import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { type HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/connexion')
  }

  async store({ i18n, session, request, response, auth }: HttpContext) {

    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)
      return response.redirect().toPath('/')

    } catch (error) {
      const errorMsg = i18n.t('messages.login_invalid')
      session.flash('loginInvalidData', errorMsg)
      return response.redirect().back()
    }
  }
}
