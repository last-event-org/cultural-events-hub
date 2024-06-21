import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Address from '#models/address'
// import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  async run() {
    await Address.createMany([
      {
        id: 1,
        name: 'Reflektor',
        street: 'Pl. Xavier-Neujean',
        number: '24',
        zipCode: 4000,
        city: 'Liège',
        country: 'Belgium',
      },
      {
        id: 2,
        name: 'Théâtre de Namur',
        street: 'Rue Bruno',
        number: '12',
        zipCode: 5000,
        city: 'Namur',
        country: 'Belgium',
      },
      {
        id: 3,
        name: 'Palais des Congrès de Liège',
        street: "Esplanade de l'Europe",
        number: '2',
        zipCode: 4020,
        city: 'Liège',
        country: 'Belgium',
      },
      {
        id: 4,
        name: 'Charleroi Expo',
        street: 'Avenue Jean Mermoz',
        number: '50',
        zipCode: 6041,
        city: 'Charleroi',
        country: 'Belgium',
      },
      {
        id: 5,
        name: 'Centre culturel de Dinant',
        street: 'Place Reine Astrid',
        number: '3',
        zipCode: 5500,
        city: 'Dinant',
        country: 'Belgium',
      },
      {
        id: 6,
        name: 'WEX Wallonie Expo',
        street: 'Rue des Deux Provinces',
        number: '1',
        zipCode: 6900,
        city: 'Marche-en-Famenne',
        country: 'Belgium',
      },
      {
        id: 7,
        name: 'Maison de la Culture de Tournai',
        street: 'Rue des Carmes',
        number: '3',
        zipCode: 7500,
        city: 'Tournai',
        country: 'Belgium',
      },
      {
        id: 8,
        name: 'Aula Magna',
        street: 'Place Raymond Lemaire',
        number: '1',
        zipCode: 1348,
        city: 'Louvain-la-Neuve',
        country: 'Belgium',
      },
      {
        id: 9,
        name: 'Centre Culturel de Huy',
        street: 'Rue Saint-Germain',
        number: '126',
        zipCode: 4500,
        city: 'Huy',
        country: 'Belgium',
      },
      {
        id: 10,
        name: 'Centre Culturel de Seraing',
        street: 'Rue Renaud Strivay',
        number: '44',
        zipCode: 4100,
        city: 'Seraing',
        country: 'Belgium',
      },
      {
        id: 11,
        name: 'Centre Culturel de Rochefort',
        street: 'Rue de Behogne',
        number: '6',
        zipCode: 5580,
        city: 'Rochefort',
        country: 'Belgium',
      },
      {
        id: 12,
        name: 'Centre Culturel de Spa',
        street: 'Place Royale',
        number: '2',
        zipCode: 4900,
        city: 'Spa',
        country: 'Belgium',
      },
      {
        id: 13,
        name: 'Cinéma Churchill',
        street: 'Place Emile Vandervelde',
        number: '3',
        zipCode: 1348,
        city: 'Louvain-la-Neuve',
        country: 'Belgium',
      },
      {
        id: 14,
        name: 'Maison de la Culture Famenne-Ardenne',
        street: 'Place Roi Baudouin',
        number: '1',
        zipCode: 6900,
        city: 'Marche-en-Famenne',
        country: 'Belgium',
      },
      {
        id: 15,
        name: 'La Spirale',
        street: 'Rue de Mulhouse',
        number: '36',
        zipCode: 4000,
        city: 'Liège',
        country: 'Belgium',
      },
    ])
  }
}
