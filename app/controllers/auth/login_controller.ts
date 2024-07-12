import User from '#models/user'
import { randomTokenString, sendNewPasswordRequest } from '#services/account_service'
import { loginValidator } from '#validators/auth'
import { EmailValidator } from '#validators/email'
import { updateUserPasswordValidator } from '#validators/password_change'
import { resetPasswordValidator } from '#validators/reset_password'
import { tokenValidator } from '#validators/token'
import { type HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
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
    console.log('requestNewPassword')
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
        console.log(lang)
        console.log(subject)
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
        }
        if (user.resetToken === token) {
          user.password = password
          user.resetToken = null
          user.resetTokenExpires = null
          await user.save()
          const successMsg = i18n.t('messages.login_reset_password_success')
          session.flash('success', successMsg)
        } else {
          const errorMsg = i18n.t('messages.login_reset_password_token_wrong')
          session.flash('error', errorMsg)
        }
      }
    } catch (error) {
      return response.redirect(request.url(true))
    }

    return response.redirect().toRoute('auth.login.show')
  }

  async changePasswordShow({ view }: HttpContext) {
    return view.render('pages/auth/change-password')
  }

  async changePasswordStore({ session, request, response, auth, i18n }: HttpContext) {
    const user = await User.findOrFail(await auth.user?.id)
    let payload

    try {
      payload = await request.validateUsing(updateUserPasswordValidator)
      if (await hash.verify(user?.password, payload?.old_password)) {
        user.password = payload.password
        await user?.save()
        const errorMsg = i18n.t('messages.editProfile_change_password_success')
        session.flash('success', errorMsg)
      } else {
        const errorMsg = i18n.t('messages.login_invalid')
        session.flash('error', errorMsg)
      }
    } catch (error) {
      const errorMsg = i18n.t('messages.error_psw')
      session.flash('error', errorMsg)
      // return response.redirect().back()
    }

    return response.redirect().back()
  }
}
