import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import string from '@adonisjs/core/helpers/string'

export async function randomTokenString() {
  return string.random(32)
}

export async function sendVerificationEmail(user: User, token: string) {
  console.log(user)
  console.log(token)
  await mail.send((message) => {
    message
      .to(user.email)
      .subject('Verify your email address')
      .htmlView('emails/verify_email', { user, token })
  })
}

export async function sendNewPasswordRequest(user: User, token: string) {
  console.log(user)
  console.log(token)
  await mail.send((message) => {
    message
      .to(user.email)
      .subject('New password request')
      .htmlView('emails/password_reset', { user, token })
  })
}
