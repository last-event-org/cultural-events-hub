import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CategoryType from '#models/category_type'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await CategoryType.createMany([
      {
        id: 1,
        name: 'Rock',
        parentCategoryId: 1,
      },
      {
        id: 2,
        name: 'Electronique',
        parentCategoryId: 1,
      },
      {
        id: 3,
        name: 'Pop',
        parentCategoryId: 1,
      },
      {
        id: 4,
        name: 'Reggae / Ragga / Dub / Ska',
        parentCategoryId: 1,
      },
      {
        id: 5,
        name: 'RnB',
        parentCategoryId: 1,
      },
      {
        id: 6,
        name: 'Chanson française',
        parentCategoryId: 1,
      },
      {
        id: 7,
        name: 'Classique',
        parentCategoryId: 1,
      },
      {
        id: 8,
        name: 'Jazz',
        parentCategoryId: 1,
      },
      {
        id: 9,
        name: 'Divers',
        parentCategoryId: 1,
      },
      {
        id: 10,
        name: 'Blues / Country / Folk',
        parentCategoryId: 1,
      },
      {
        id: 11,
        name: 'Festival',
        parentCategoryId: 1,
      },
      {
        id: 12,
        name: 'Hip-Hop / Rap',
        parentCategoryId: 1,
      },
      {
        id: 13,
        name: 'Métal',
        parentCategoryId: 1,
      },
      {
        id: 14,
        name: 'Stand-up',
        parentCategoryId: 2,
      },
      {
        id: 15,
        name: 'Amateur',
        parentCategoryId: 2,
      },
      {
        id: 16,
        name: 'Cabaret',
        parentCategoryId: 2,
      },
      {
        id: 17,
        name: 'Danse',
        parentCategoryId: 2,
      },
      {
        id: 18,
        name: 'Cirque',
        parentCategoryId: 2,
      },
      {
        id: 19,
        name: 'Comédie musicale',
        parentCategoryId: 2,
      },
      {
        id: 20,
        name: 'Magie',
        parentCategoryId: 2,
      },
      {
        id: 21,
        name: 'Humour / Comédie',
        parentCategoryId: 2,
      },
      {
        id: 22,
        name: 'Dance',
        parentCategoryId: 3,
      },
      {
        id: 23,
        name: 'Electro',
        parentCategoryId: 3,
      },
      {
        id: 24,
        name: 'Hip-Hop / Rap',
        parentCategoryId: 3,
      },
      {
        id: 25,
        name: 'Latino',
        parentCategoryId: 3,
      },
      {
        id: 26,
        name: 'Pop',
        parentCategoryId: 3,
      },
      {
        id: 27,
        name: 'Rock',
        parentCategoryId: 3,
      },
      {
        id: 28,
        name: 'Techno / House',
        parentCategoryId: 3,
      },
      {
        id: 29,
        name: 'Divers',
        parentCategoryId: 3,
      },
      {
        id: 30,
        name: 'Metal',
        parentCategoryId: 3,
      },
      {
        id: 31,
        name: 'Peintures',
        parentCategoryId: 4,
      },
      {
        id: 32,
        name: 'Sculptures',
        parentCategoryId: 4,
      },
      {
        id: 33,
        name: 'Design',
        parentCategoryId: 4,
      },
      {
        id: 34,
        name: 'Photographies',
        parentCategoryId: 4,
      },
      {
        id: 35,
        name: 'Galerie',
        parentCategoryId: 4,
      },
      {
        id: 36,
        name: 'Divers',
        parentCategoryId: 4,
      },
      {
        id: 37,
        name: 'Salon / Foire',
        parentCategoryId: 5,
      },
      {
        id: 38,
        name: 'Artisanat',
        parentCategoryId: 5,
      },
      {
        id: 39,
        name: 'Divers',
        parentCategoryId: 5,
      },
      {
        id: 40,
        name: 'Tournoi / Compétition',
        parentCategoryId: 6,
      },
      {
        id: 41,
        name: 'Sport intérieur',
        parentCategoryId: 6,
      },
      {
        id: 42,
        name: 'Sport extérieur',
        parentCategoryId: 6,
      },
    ])
  }
}
