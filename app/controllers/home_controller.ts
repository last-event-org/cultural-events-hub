import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class HomeController {
  async index({ view, auth }: HttpContext) {
    await auth.check()
    const categories = await Category.query()

    const dayBegin = DateTime.now().toSQL()
    console.log(dayBegin)
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQL()
    console.log(dayEnd)

    const events = await Event.query()
      .andWhereBetween('event_start', [dayBegin, dayEnd])
      .andWhereHas('prices', (query) => query.where('available_qty', '>', 0))
      .preload('location')
      .preload('categoryTypes')
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .limit(1)

    // TODO get category

    // let event = await Event.find(78)
    // event = await event?.related('prices').query()
    // console.log(event)
    // const events = await Event.query()
    //   .innerJoin('prices', (query) => {
    //     query.on('events.id', '=', 'prices.event_id').andOnVal('available_qty', '>=', 0)
    //   })
    //   .limit(1)

    // const events = Event.query()
    //   .preload('prices', (subquery) => {
    //     subquery.where('available_qty', '>=', 0)
    //   })
    //   .preload('categoryTypes')
    //   .where('id', 69)

    console.log(events)

    return view.render('pages/home', { categories: categories, events: events })
  }
}
