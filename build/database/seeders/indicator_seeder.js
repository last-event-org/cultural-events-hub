import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Indicator from '#models/indicator';
export default class extends BaseSeeder {
    async run() {
        await Indicator.createMany([
            {
                id: 1,
                name: 'Spécial enfants',
                slug: 'special_enfants',
            },
            {
                id: 2,
                name: 'Spécial étudiants',
                slug: 'special_etudiants',
            },
            {
                id: 3,
                name: 'Spécial familles',
                slug: 'special_familles',
            },
            {
                id: 4,
                name: 'Accès PMR',
                slug: 'acces_pmr',
            },
            {
                id: 5,
                name: 'Article 27',
                slug: 'article_27',
            },
            {
                id: 6,
                name: 'Sourds / Malentendants',
                slug: 'sourds_malentendants',
            },
        ]);
    }
}
//# sourceMappingURL=indicator_seeder.js.map