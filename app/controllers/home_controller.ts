import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class HomeController {
  async index({ view, auth, response }: HttpContext) {
    await auth.check()
    const categories = await Category.query().select('name', 'slug', 'id')

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    const events = await Event.query()
      .andWhereBetween('event_start', [dayBegin, dayEnd])
      .andWhereHas('prices', (query) => query.where('available_qty', '>', 0))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media', (mediaQuery) => {
        mediaQuery.select('path', 'altName')
      })
      .orderBy('event_start', 'asc')

    const topEvents = await this.getTopEvents()
    const todayEvents = await this.getTodayEvents()
    return view.render('pages/home', {
      categories: categories,
      events: events,
      topEvents: topEvents,
      todayEvents: todayEvents,
    })
  }

  async getTodayEvents() {
    console.log('getevents today')
    // const events = await db.from('events').select('title', 'subtitle', 'description')

    const dayBegin = DateTime.now().toSQLDate()
    console.log(dayBegin)
    let dayEnd: string = DateTime.now().set({ hour: 23, minute: 59, second: 59 }).toSQL() ?? ''
    console.log(dayEnd)

    const events = await Event.query()
      .select('id', 'location_id', 'title')
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location', (locationQuery) => locationQuery.select('id', 'name', 'city'))
      .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
      .orderBy('event_start', 'asc')
      .limit(5)

    return events
  }

  async getTopEvents() {
    console.log('getevents top')

    const dayBegin = DateTime.now().toSQLDate()
    console.log(dayBegin)
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()
    console.log(dayEnd)

    const events = await Event.query()
      .select('id', 'location_id', 'title')
      .whereBetween('event_start', [dayBegin, dayEnd])
      .preload('location', (locationQuery) => locationQuery.select('id', 'name', 'city'))
      .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
      .limit(5)

    return events
  }
}
