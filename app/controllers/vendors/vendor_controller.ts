import { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import OrderLine from '#models/order_line'

export default class VendorController {
  async orders({ view, auth, session }: HttpContext) {
    await auth.check()

    let ordersVendor = await OrderLine.query()
      .select('events.id as eventId')
      .select('events.event_start as eventStart')
      .select('events.event_end as eventEnd')
      .select('events.title as title')
      .select('media.path as path')
      .select('media.alt_name as altName')
      .sum('order_lines.qty as total_qty')
      .sum('prices.available_qty as total_available_qty')
      .sum('prices.discounted_price as total_amount')
      .join('prices', 'order_lines.price_id', 'prices.id')
      .join('events', 'prices.event_id', 'events.id')
      .join('orders', 'order_lines.order_id', 'orders.id')
      .join('media', 'media.event_id', 'events.id')
      .where('orders.is_paid', true)
      .where('events.vendor_id', auth.user.id)
      .groupBy('events.id', 'events.title', 'media.path', 'media.alt_name')
      .orderBy('event_start', 'asc')

    // put all event ids in an array to select the order lines
    let eventIds = ordersVendor.map((e) => e.$extras.eventId)

    // select oll the order lines based on the orders above
    let orderLines = await OrderLine.query()
      .select('events.id as event_id')
      .select('events.title as event_title')
      .select('prices.description as price_description')
      .select('prices.id as price_id')
      .select('prices.available_qty as price_available_qty')
      .sum('order_lines.qty as total_qty')
      .sum('prices.discounted_price as total_amount')
      .count('order_lines.id as order_lines_count')
      .join('prices', 'order_lines.price_id', 'prices.id')
      .join('events', 'prices.event_id', 'events.id')
      .join('orders', 'order_lines.order_id', 'orders.id')
      .where('orders.is_paid', true)
      .whereIn('events.id', eventIds)
      .groupBy('events.id', 'events.title', 'prices.id', 'prices.description')
      .orderBy('events.id')

    // group order lines by event
    const groupedOrderLines = orderLines.reduce((acc, orderLine) => {
      const eventId = orderLine.$extras.event_id
      if (!acc[eventId]) {
        acc[eventId] = {
          [eventId]: eventId,
          event_title: orderLine.$extras.event_title,
          order_lines: [],
        }
      }
      acc[eventId].order_lines.push(orderLine)
      return acc
    }, {})

    console.log(groupedOrderLines[0])
    return view.render('pages/dashboard/vendor/orders', {
      orders: ordersVendor.length === 0 ? null : ordersVendor,
      orderLines: Object.values(groupedOrderLines).length === 0 ? null : groupedOrderLines,
    })
  }

  async events({ response, view, auth }: HttpContext) {
    await auth.check()

    const events = await Event.query()
      .where('vendor_id', auth.user?.id)
      .preload('location')
      .preload('categoryTypes', (categoryTypesQuery) => {
        categoryTypesQuery.preload('category')
      })
      .preload('indicators')
      .preload('prices')
      .preload('media')
      .orderBy('event_start', 'asc')

    return view.render('pages/dashboard/vendor/events', {
      events: events.length === 0 ? null : events,
    })
  }
}
