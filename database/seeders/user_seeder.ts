import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'


export default class extends BaseSeeder {
  async run() {
    await User.create({username: "admin", email: "admin@admin.com", password: "pass1234", firstname: "Admin", lastname: "Admin"})
    await User.create({username: "user", email: 'user@user.com', password: 'pass1234', firstname:"John", lastname:"Doe"})
    await User.create({username: "vendor", email:"vendor@vendor.com", password:"pass1234", firstname:"Bob", lastname:"Sil"})
  }
}