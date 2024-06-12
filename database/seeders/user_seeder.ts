import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'sam@sam.com',
      password: 'pass1234'
    })
  }
}