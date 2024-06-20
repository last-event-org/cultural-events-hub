import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class HomeController {
  async index({ view, auth }: HttpContext) {
    await auth.check()
    const categories = await Category.query()

    const dayBegin = DateTime.now().toSQL()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQL()

    const events = await Event.query()
      .andWhereBetween('event_start', [dayBegin, dayEnd])
      .andWhereHas('prices', (query) => query.where('available_qty', '>', 0))
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')

    console.log(events)

    return view.render('pages/home', { categories: categories, events: events })
  }
}
