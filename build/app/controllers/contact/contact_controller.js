import { sendContactForm, sendContactFormCopy } from '#services/account_service';
import { contactValidator } from '#validators/contact';
import { errors } from '@vinejs/vine';
import env from '#start/env';
export default class ContactController {
    async show({ view, session }) {
        return view.render('pages/contact/contact');
    }
    async post({ request, session, response, i18n }) {
        console.log('POST CONTACT FORM');
        const language = i18n.locale;
        console.log(request.body());
        const recaptachaResponse = request.body()['g-recaptcha-response'];
        try {
            const responseGoogle = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${env.get('GOOGLE_SECRET_KEY')}&response=${recaptachaResponse}`);
            const data = await responseGoogle.json();
            if (data?.success) {
                try {
                    console.log('success');
                    let { name, email, message, copy } = await request.validateUsing(contactValidator);
                    let copyrequired;
                    const subject = `Contact Form - ${name} / ${email}`;
                    copy === undefined ? (copyrequired = false) : (copyrequired = true);
                    await sendContactForm(name, email, message, language, subject);
                    if (copyrequired) {
                        const subjectCopy = `COPY Contact Form - ${name} / ${email}`;
                        await sendContactFormCopy(name, email, message, language, subjectCopy);
                    }
                    const successMsg = i18n.t('messages.successContactFormSent');
                    session.flash('success', successMsg);
                    return response.redirect().toRoute('contact.show');
                }
                catch (error) {
                    if (error instanceof errors.E_VALIDATION_ERROR) {
                        console.log(error.messages);
                    }
                    const errorMsg = i18n.t('messages.errorContactFormSent');
                    session.flash('error', errorMsg);
                    return response.redirect().back();
                }
            }
            else {
                const errorMsg = i18n.t('messages.errorContactFormCaptcha');
                session.flash('error', errorMsg);
                return response.redirect().back();
            }
        }
        catch (error) {
            console.log(error);
            const errorMsg = i18n.t('messages.errorContactFormCaptcha');
            session.flash('error', errorMsg);
            return response.redirect().back();
        }
    }
}
//# sourceMappingURL=contact_controller.js.map