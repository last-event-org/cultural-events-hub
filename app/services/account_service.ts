import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import string from '@adonisjs/core/helpers/string'

export async function randomTokenString() {
  return string.random(32)
}

export async function sendVerificationEmail(
  user: User,
  token: string,
  origin: string,
  language: string,
  subject: string
) {
  await mail.send((message) => {
    message
      .to(user.email)
      .subject(subject)
      .htmlView(`emails/${language}/verify_email`, { user, token, origin, subject, language })
  })
}

export async function sendNewPasswordRequest(
  user: User,
  token: string,
  origin: string,
  language: string,
  subject: string
) {
  console.log('sendNewPasswordRequest')
  console.log(language)
  console.log(subject)
  await mail.send((message) => {
    message
      .to(user.email)
      .subject(subject)
      .htmlView(`emails/${language}/password_reset`, { user, token, origin, subject, language })
  })
}

export async function sendAccountVerified(
  user: User,
  origin: string,
  language: string,
  subject: string
) {
  await mail.send((message) => {
    message
      .to(user.email)
      .subject(subject)
      .htmlView(`emails/${language}/account_verified`, { user, origin, subject, language })
  })
}
