import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'


export default class extends BaseSeeder {
  async run() {
    await Role.create({roleName: 'ADMIN', canCreateEvent: true, canUpdateEvent: true, canDeleteEvent: true, canCreateAddress: true, canUpdateAddress: true, canDeleteAddress: true, canCreateCategory: true, canUpdateCategory: true, canDeleteCategory: true, canBlockUser: true, canUpdateUser: true, canDeleteUser: true})
    await Role.create({roleName: 'USER', canCreateEvent: false, canUpdateEvent: false, canDeleteEvent: false, canCreateAddress: false, canUpdateAddress: false, canDeleteAddress: false, canCreateCategory: false, canUpdateCategory: false, canDeleteCategory: false, canBlockUser: false, canUpdateUser: false, canDeleteUser: false})
    await Role.create({roleName: 'VENDOR', canCreateEvent: true, canUpdateEvent: true, canDeleteEvent: true, canCreateAddress: true, canUpdateAddress: true, canDeleteAddress: true, canCreateCategory: false, canUpdateCategory: false, canDeleteCategory: false, canBlockUser: false, canUpdateUser: false, canDeleteUser: false})
  }
}