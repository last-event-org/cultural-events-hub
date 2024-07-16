import Event from '#models/event';
import env from '#start/env';
import { DateTime } from 'luxon';
import Category from '#models/category';
import CategoryType from '#models/category_type';
import { queryValidator } from '#validators/query';
import db from '@adonisjs/lucid/services/db';
export default class ListEvents {
    async getEvents() {
        console.log('getevents api');
        const dayBegin = DateTime.now().toSQLDate();
        const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate();
        const events = await Event.query()
            .andWhereBetween('event_start', [dayBegin, dayEnd])
            .preload('location')
            .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category');
        })
            .preload('indicators')
            .preload('prices')
            .preload('media')
            .orderBy('event_start', 'asc');
        return events;
    }
    async getEventsByDate(dateQuery) {
        console.log('geteventsbydate api');
        let isoDate = new Date(dateQuery).toISOString();
        let date = DateTime.fromISO(isoDate);
        let dayBegin = date.toSQL() ?? '';
        let dayEnd = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? '';
        const events = await Event.query()
            .whereBetween('event_start', [dayBegin, dayEnd])
            .preload('location')
            .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category');
        })
            .preload('indicators')
            .preload('prices')
            .preload('media')
            .orderBy('event_start', 'asc');
        return events;
    }
    async getEventsSearch({ request }) {
        let qs = request.qs();
        let payload;
        let [latitude, longitude] = [50.645138, 5.57342];
        let ids;
        let radius = 15;
        let [dayBegin, dayEnd] = [0, 0];
        let category;
        let categoryTypesId = [];
        let categoryTypes;
        try {
            payload = await request.validateUsing(queryValidator);
        }
        catch (error) {
            return 'ERROR';
        }
        if (qs.city) {
            console.log('\n CITY \n');
            try {
                ;
                [latitude, longitude] = await this.getCoordinatesFromCity(payload?.city);
                if (qs.radius) {
                    radius = payload?.radius;
                }
                ids = await this.findEventsIDByLocation(latitude, longitude, radius);
            }
            catch (error) {
                return 'ERROR';
            }
        }
        if (qs.date) {
            console.log('\n DATE \n');
            [dayBegin, dayEnd] = await this.formatDate(payload?.date);
        }
        if (qs.categoryType) {
            const categoryTypeId = await CategoryType.find(qs.categoryType);
            category = await categoryTypeId
                ?.related('category')
                .query()
                .select('name', 'id', 'slug')
                .preload('categoryTypes')
                .first();
            console.log(category);
            categoryTypes = category?.categoryTypes;
            categoryTypesId = [qs.categoryType];
        }
        else if (qs.category) {
            category = await Category.find(qs.category);
            categoryTypes = await category?.related('categoryTypes').query();
            categoryTypes?.forEach((categoryType) => {
                categoryTypesId.push(categoryType.$attributes.id);
            });
        }
        const events = await Event.query()
            .if(qs.city, (query) => query.whereIn('id', ids))
            .if(qs.vendor, (query) => query.where('vendor_id', qs.vendor))
            .if(qs.location, (query) => query.where('location_id', qs.location))
            .if(qs.date, (query) => query.whereBetween('event_start', [dayBegin, dayEnd]))
            .if(categoryTypesId.length > 0, (query) => query.whereHas('categoryTypes', (categoryTypeQuery) => {
            categoryTypeQuery.whereInPivot('category_type_id', categoryTypesId);
        }))
            .if(!qs.date, (query) => query.where('event_start', '>=', new Date().toISOString()))
            .preload('location')
            .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery.preload('category');
        })
            .preload('indicators')
            .preload('prices')
            .preload('media')
            .orderBy('event_start', 'asc');
        return events;
    }
    async formatDate(dateQuery) {
        let isoDate = new Date(dateQuery).toISOString();
        let date = DateTime.fromISO(isoDate);
        let dayBegin = date.toSQL() ?? '';
        let dayEnd = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? '';
        return [dayBegin, dayEnd];
    }
    async getCoordinatesFromCity(city) {
        console.log('getCoordinatesFromCity');
        try {
            const response = await fetch(`https://api.openrouteservice.org/geocode/search/structured?api_key=${env.get('API_KEY_ROUTERSERVICE')}&country=belgium&locality=${city}&boundary.country=BE`);
            const datas = await response.json();
            console.log(datas);
            return [datas.features[0].geometry.coordinates[1], datas.features[0].geometry.coordinates[0]];
        }
        catch (e) {
            console.log('ERROR');
            console.log(e);
        }
    }
    async findEventsIDByLocation(lat, long, radius) {
        console.log('\n findEventsIDByLocation \n');
        const eventsId = await db.rawQuery(`
    SELECT e.id
    FROM events e
    JOIN addresses l ON e.location_id = l.id
    WHERE ST_Distance_Sphere(
        POINT(l.longitude, l.latitude), 
        POINT(${long}, ${lat})
    ) <= ${radius ? radius * 1000 : 15 * 1000}
  `);
        let ids = [];
        eventsId[0].forEach((element) => {
            ids.push(element.id);
        });
        console.log(ids);
        return ids;
    }
}
//# sourceMappingURL=api_listevents.js.map