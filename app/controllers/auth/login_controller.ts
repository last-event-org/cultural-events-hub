import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { type HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/connexion')
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)
    } catch (error) {
      console.log('\n\n\n\n\n\n error : ' + error)
    }

    return response.redirect().toPath('/')
  }
}
