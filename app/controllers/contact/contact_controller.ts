import { sendContactForm, sendContactFormCopy } from '#services/account_service'
import { contactValidator } from '#validators/contact'
import type { HttpContext } from '@adonisjs/core/http'
import vine, { errors } from '@vinejs/vine'

export default class ContactController {
  async show({ view }: HttpContext) {
    return view.render('pages/contact/contact')
  }

  async post({ request, session, response, i18n }: HttpContext) {
    console.log('POST CONTACT FORM')
    const language = i18n.locale

    try {
      let { name, email, message, copy } = await request.validateUsing(contactValidator)
      let copyrequired
      const subject = `Contact Form - ${name} / ${email}`
      copy === undefined ? (copyrequired = false) : (copyrequired = true)
      await sendContactForm(name, email, message, language, subject)
      if (copyrequired) {
        const subjectCopy = `COPY Contact Form - ${name} / ${email}`
        await sendContactFormCopy(name, email, message, language, subjectCopy)
      }

      const successMsg = i18n.t('messages.successContactFormSent')
      session.flash('success', successMsg)
      return response.redirect().toRoute('contact.show')
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      const errorMsg = i18n.t('messages.errorContactFormSent')
      session.flash('error', errorMsg)
      return response.redirect().back()
    }
  }
}
