import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        id: 1,
        name: 'Concerts',
        slug: 'concerts',
      },
      {
        id: 2,
        name: 'Théâtre / Spectacles',
        slug: 'theatre_spectacles',
      },
      {
        id: 3,
        name: 'Soirées',
        slug: 'soirees',
      },
      {
        id: 4,
        name: 'Expos',
        slug: 'expos',
      },
      {
        id: 5,
        name: 'Salons / Foires',
        slug: 'salons_foires',
      },
      {
        id: 6,
        name: 'Sports',
        slug: 'sports',
      },
    ])
  }
}
