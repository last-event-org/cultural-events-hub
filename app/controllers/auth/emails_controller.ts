import mail from '@adonisjs/mail/services/main'
import emitter from '@adonisjs/core/services/emitter'

export default class EmailsController {
  async sendNewUserMail(account, token) {
    console.log(account)
    console.log(token)
    await mail.send((message) => {
      message
        .to(account.email)
        .subject('Verify your email address')
        .htmlView('emails/verify_email', { account, token })
    })

    emitter.on('mail:sent', (event) => {
      console.log(event.response)

      console.log(event.mailerName)
      console.log(event.message)
      console.log(event.views)
    })
  }
}
