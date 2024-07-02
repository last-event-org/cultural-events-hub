import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'
import Order from '#models/order'

export default class HomeController {
  async index({ i18n, view, auth, response }: HttpContext) {
    await auth.check()
    const categories = await Category.query().select('name', 'slug', 'id')

    const dayBegin = DateTime.now().toSQLDate()
    const dayEnd = DateTime.now().plus({ days: 7 }).toSQLDate()

    let order = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', false)
    console.log(order)
    if (!auth.isAuthenticated || order.length === 0) {
      response.clearCookie('orderId')
    } else {
      response.cookie('orderId', order[0].id)
    }

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

    return view.render('pages/home', { categories: categories, events: events, i18n: i18n })
  }
}
