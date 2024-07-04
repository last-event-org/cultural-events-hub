import Event from '#models/event'
import { DateTime } from 'luxon'
import EventsController from './events/events_controller.js'

export default class ListEvents {
  /**
   * Display a list of resource
   */
  async getEvents() {
    console.log('getevents api')
    // const events = await db.from('events').select('title', 'subtitle', 'description')

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    const events = await Event.query()
      .andWhereBetween('event_start', [dayBegin, dayEnd])
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')
    return events
  }

  async getEventsByDate(dateQuery: any) {
    console.log('geteventsbydate api')
    // const events = await db.from('events').select('title', 'subtitle', 'description')
    let isoDate = new Date(dateQuery).toISOString()
    let date = DateTime.fromISO(isoDate)
    let dayBegin: string = date.toSQL() ?? ''
    let dayEnd: string = date.set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''

    const events = await Event.query()
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')
    return events
  }
}
