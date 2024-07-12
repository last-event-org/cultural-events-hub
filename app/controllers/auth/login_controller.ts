import User from '#models/user'
import { randomTokenString, sendNewPasswordRequest } from '#services/account_service'
import { loginValidator } from '#validators/auth'
import { EmailValidator } from '#validators/email'
import { resetPasswordValidator } from '#validators/reset_password'
import { tokenValidator } from '#validators/token'
import { type HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ i18n, session, request, response, auth }: HttpContext) {
    console.log('store')
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      if (user.isVerified) {
        await auth.use('web').login(user)
        return response.redirect().toRoute('home')
      } else {
        console.log('user is not verified')
        const errorMsg = i18n.t('messages.login_verified_no')
        session.flash('error', errorMsg)
        return response.redirect().back()
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      const errorMsg = i18n.t('messages.login_invalid')
      session.flash('loginInvalidData', errorMsg)
      return response.redirect().back()
    }
  }

  async forgotPassword({ view }: HttpContext) {
    return view.render('pages/auth/forgot-password')
  }

  async requestNewPassword({ response, request, session, i18n }: HttpContext) {
    const lang = i18n.locale
    const parsedUrl = new URL(request.completeUrl())
    const origin = `${parsedUrl.protocol}//${parsedUrl.host}`
    console.log(origin)

    try {
      const { email } = await request.validateUsing(EmailValidator)
      const user = await User.findBy('email', email)
      if (user) {
        const token = await randomTokenString()
        user.resetToken = token
        const expirationDate = DateTime.now().plus({ minutes: 30 })
        user.resetTokenExpires = expirationDate
        await user?.save()
        const subject = i18n.t('messages.mail_reset_password_subject')
        await sendNewPasswordRequest(user, token, origin, lang, subject)
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

  async resetPasswordShow({ view }: HttpContext) {
    return view.render('pages/auth/reset-password')
  }

  async resetPasswordStore({ response, request, session, i18n }: HttpContext) {
    const data = {
      token: request.qs().token,
    }

    try {
      const { email, password } = await request.validateUsing(resetPasswordValidator)
      const { token } = await tokenValidator.validate(data)
      const user = await User.findByOrFail('email', email)
      if (!user.resetTokenExpires) {
        const errorMsg = i18n.t('messages.login_invalid')
        session.flash('error', errorMsg)
        return response.redirect(request.url(true))
      } else {
        if (DateTime.now() > user?.resetTokenExpires) {
          const errorMsg = i18n.t('messages.login_reset_password_token_expired')
          session.flash('error', errorMsg)
          return response.redirect().toRoute('auth.login.show')
        }
        if (user.resetToken === token) {
          user.password = password
          user.resetToken = null
          user.resetTokenExpires = null
          await user.save()
          const successMsg = i18n.t('messages.login_reset_password_success')
          session.flash('success', successMsg)
          return response.redirect().toRoute('auth.login.show')
        } else {
          const errorMsg = i18n.t('messages.login_reset_password_token_wrong')
          session.flash('error', errorMsg)
          return response.redirect().toRoute('auth.login.show')
        }
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      console.log('ERROR')
      return response.redirect(request.url(true))
    }
  }
}
