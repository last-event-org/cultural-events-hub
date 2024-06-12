import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        id: 1,
        name: 'Concerts',
      },
      {
        id: 2,
        name: 'Théâtre / Spectacles',
      },
      {
        id: 3,
        name: 'Soirées',
      },
      {
        id: 4,
        name: 'Expos',
      },
      {
        id: 5,
        name: 'Salons / Foires',
      },
      {
        id: 6,
        name: 'Sports',
      },
    ])
  }
}
