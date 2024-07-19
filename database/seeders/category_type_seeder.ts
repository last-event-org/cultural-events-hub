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
        slug: 'rock',
      },
      {
        id: 2,
        name: 'Electronique',
        parentCategoryId: 1,
        slug: 'electronique',
      },
      {
        id: 3,
        name: 'Pop',
        parentCategoryId: 1,
        slug: 'pop',
      },
      {
        id: 4,
        name: 'Reggae / Ragga / Dub / Ska',
        parentCategoryId: 1,
        slug: 'reggae',
      },
      {
        id: 5,
        name: 'RnB',
        parentCategoryId: 1,
        slug: 'rnb',
      },
      {
        id: 6,
        name: 'Chanson française',
        parentCategoryId: 1,
        slug: 'chanson_francaise',
      },
      {
        id: 7,
        name: 'Classique',
        parentCategoryId: 1,
        slug: 'classique',
      },
      {
        id: 8,
        name: 'Jazz',
        parentCategoryId: 1,
        slug: 'jazz',
      },
      {
        id: 9,
        name: 'Métal',
        parentCategoryId: 1,
        slug: 'metal',
      },

      {
        id: 10,
        name: 'Blues / Country / Folk',
        parentCategoryId: 1,
        slug: 'blues',
      },
      {
        id: 11,
        name: 'Festival',
        parentCategoryId: 1,
        slug: 'festival',
      },
      {
        id: 12,
        name: 'Hip-Hop / Rap',
        parentCategoryId: 1,
        slug: 'hiphop',
      },

      {
        id: 13,
        name: 'Divers',
        parentCategoryId: 1,
        slug: 'divers',
      },
      {
        id: 14,
        name: 'Stand-up',
        parentCategoryId: 2,
        slug: 'stand_up',
      },
      {
        id: 15,
        name: 'Amateur',
        parentCategoryId: 2,
        slug: 'amateur',
      },
      {
        id: 16,
        name: 'Cabaret',
        parentCategoryId: 2,
        slug: 'cabaret',
      },
      {
        id: 17,
        name: 'Danse',
        parentCategoryId: 2,
        slug: 'danse',
      },
      {
        id: 18,
        name: 'Cirque',
        parentCategoryId: 2,
        slug: 'cirque',
      },
      {
        id: 19,
        name: 'Comédie musicale',
        parentCategoryId: 2,
        slug: 'comedie_musicale',
      },
      {
        id: 20,
        name: 'Magie',
        parentCategoryId: 2,
        slug: 'magie',
      },
      {
        id: 21,
        name: 'Humour / Comédie',
        parentCategoryId: 2,
        slug: 'humour_comedie',
      },

      {
        id: 22,
        name: 'Dance',
        parentCategoryId: 3,
        slug: 'dance',
      },
      {
        id: 23,
        name: 'Electro',
        parentCategoryId: 3,
        slug: 'electro',
      },
      {
        id: 24,
        name: 'Hip-Hop / Rap',
        parentCategoryId: 3,
        slug: 'hiphop',
      },
      {
        id: 25,
        name: 'Latino',
        parentCategoryId: 3,
        slug: 'latino',
      },
      {
        id: 26,
        name: 'Pop',
        parentCategoryId: 3,
        slug: 'pop',
      },
      {
        id: 27,
        name: 'Rock',
        parentCategoryId: 3,
        slug: 'rock',
      },
      {
        id: 28,
        name: 'Techno / House',
        parentCategoryId: 3,
        slug: 'techno',
      },

      {
        id: 29,
        name: 'Metal',
        parentCategoryId: 3,
        slug: 'metal',
      },
      {
        id: 30,
        name: 'Divers',
        parentCategoryId: 3,
        slug: 'divers',
      },
      {
        id: 31,
        name: 'Peintures',
        parentCategoryId: 4,
        slug: 'peintures',
      },
      {
        id: 32,
        name: 'Sculptures',
        parentCategoryId: 4,
        slug: 'sculptures',
      },
      {
        id: 33,
        name: 'Design',
        parentCategoryId: 4,
        slug: 'design',
      },
      {
        id: 34,
        name: 'Photographies',
        parentCategoryId: 4,
        slug: 'photographies',
      },
      {
        id: 35,
        name: 'Galerie',
        parentCategoryId: 4,
        slug: 'galerie',
      },
      {
        id: 36,
        name: 'Divers',
        parentCategoryId: 4,
        slug: 'divers',
      },
      {
        id: 37,
        name: 'Salon / Foire',
        parentCategoryId: 5,
        slug: 'salon_foire',
      },
      {
        id: 38,
        name: 'Artisanat',
        parentCategoryId: 5,
        slug: 'artisanat',
      },
      {
        id: 39,
        name: 'Divers',
        parentCategoryId: 5,
        slug: 'divers',
      },
      {
        id: 40,
        name: 'Tournoi / Compétition',
        parentCategoryId: 6,
        slug: 'tournoi',
      },
      {
        id: 41,
        name: 'Sport intérieur',
        parentCategoryId: 6,
        slug: 'sport_interieur',
      },
      {
        id: 42,
        name: 'Sport extérieur',
        parentCategoryId: 6,
        slug: 'sport_exterieur',
      },
      {
        id: 43,
        name: 'Divers',
        parentCategoryId: 2,
        slug: 'divers',
      },

      {
        id: 44,
        name: 'Divers',
        parentCategoryId: 6,
        slug: 'divers',
      },
    ])
  }
}
