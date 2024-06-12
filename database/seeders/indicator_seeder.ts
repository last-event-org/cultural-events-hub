import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Indicator from '#models/indicator'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await Indicator.createMany([
      {
        id: 1,
        name: 'Spécial enfants',
      },
      {
        id: 2,
        name: 'Spécial étudiants',
      },
      {
        id: 3,
        name: 'Spécial familles',
      },
      {
        id: 4,
        name: 'Accès PMR',
      },
      {
        id: 5,
        name: 'Article 27',
      },
      {
        id: 6,
        name: 'Sourds / Malentendants',
      },
    ])
  }
}
