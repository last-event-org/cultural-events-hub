import User from '#models/user'
import { randomTokenString, sendNewPasswordRequest } from '#services/account_service'
import { loginValidator } from '#validators/auth'
import { EmailValidator } from '#validators/email'
import { type HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/connexion')
  }

  async store({ i18n, session, request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      if (user.isVerified) {
        await auth.use('web').login(user)
        return response.redirect().toRoute('home')
      } else {
        const errorMsg = i18n.t('messages.login_verified_no')
        session.flash('error', errorMsg)
        return response.redirect().back()
      }
    } catch (error) {
      const errorMsg = i18n.t('messages.login_invalid')
      session.flash('loginInvalidData', errorMsg)
      return response.redirect().back()
    }
  }

  async forgotPassword({ response, request, session, view, i18n }: HttpContext) {
    console.log('NEW PASSWORD FORM')
    console.log()

    return view.render('pages/auth/forgot-password')
  }

  async requestNewPassword({ response, request, session, i18n }: HttpContext) {
    console.log('NEW PASSWORD REQUEST')
    console.log(request.input('email'))

    try {
      console.log('TRY')
      const { email } = await request.validateUsing(EmailValidator)
      console.log(email)
      const user = await User.findBy('email', email)
      console.log('user')
      console.log(user)
      if (user) {
        const token = await randomTokenString()
        user.resetToken = token
        const expirationDate = DateTime.now().plus({ minutes: 30 })
        user.resetTokenExpires = expirationDate
        await user?.save()
        await sendNewPasswordRequest(user, token)
        const successMsg = i18n.t('messages.login_new_password_request_success')
        session.flash('success', successMsg)
        return response.redirect().back()
      }
    } catch (error) {
      const errorMsg = i18n.t('messages.login_invalid')
      session.flash('error', errorMsg)
      return response.redirect().back()
    }
  }

  async resetPassword({ response, request, session, view, i18n }: HttpContext) {
    console.log('NEW PASSWORD FORM')
    console.log()

    // return view.render('pages/auth/forgot-password')
  }
}
