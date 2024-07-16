import mail from '@adonisjs/mail/services/main';
import string from '@adonisjs/core/helpers/string';
export async function randomTokenString() {
    return string.random(32);
}
export async function sendVerificationEmail(user, token, origin, language, subject) {
    await mail.send((message) => {
        message
            .to(user.email)
            .subject(subject)
            .htmlView(`emails/${language}/verify_email`, { user, token, origin, subject, language });
    });
}
export async function sendNewPasswordRequest(user, token, origin, language, subject) {
    console.log('sendNewPasswordRequest');
    console.log(language);
    console.log(subject);
    await mail.send((message) => {
        message
            .to(user.email)
            .subject(subject)
            .htmlView(`emails/${language}/password_reset`, { user, token, origin, subject, language });
    });
}
export async function sendAccountVerified(user, origin, language, subject) {
    await mail.send((message) => {
        message
            .to(user.email)
            .subject(subject)
            .htmlView(`emails/${language}/account_verified`, { user, origin, subject, language });
    });
}
export async function sendContactForm(name, email, messageText, language, subject) {
    console.log('sendContactForm');
    await mail.send((message) => {
        message
            .to('nexteventsbe@gmail.com')
            .replyTo(email)
            .subject(subject)
            .htmlView(`emails/${language}/contact_form`, {
            email,
            messageText,
            name,
            subject,
        });
    });
}
export async function sendContactFormCopy(name, email, messageText, language, subject) {
    await mail.send((message) => {
        message.to(email).subject(subject).htmlView(`emails/${language}/contact_form_copy`, {
            email,
            messageText,
            name,
            subject,
        });
    });
}
//# sourceMappingURL=account_service.js.map