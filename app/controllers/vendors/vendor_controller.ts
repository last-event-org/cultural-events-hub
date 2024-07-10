import { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Order from '#models/order'
import OrderLine from '#models/order_line'

export default class VendorController {
  async orders({ view, auth }: HttpContext) {
    await auth.check()
    console.log('UUUUSSSERRRR')
    console.log(auth.user.id)

    // get all events with tickets up to now
    let ordersVendor = await OrderLine.query()
      .whereHas('order', (orderQuery) => {
        orderQuery.where('is_paid', true)
      })
      .whereHas('price', (priceQuery) => {
        priceQuery.whereHas('event', (eventQuery) => {
          eventQuery.where('vendor_id', auth.user?.id)
        })
      })
      .preload('order', (orderQuery) => {
        orderQuery.preload('user')
      })
      .preload('price', (priceQuery) => {
        priceQuery.preload('event')
      })

    console.log('\n\n\n ORDERS \n\n\n')
    console.log(ordersVendor.length)
    console.log(ordersVendor)
    // console.log(ordersVendor[)
    // ordersVendor.forEach((elem) => {
    //   console.log(elem)
    // console.log(elem.price)

    // console.log(elem.orderLineId)
    // })
    // console.log(orders)

    return view.render('pages/dashboard/vendor/orders', {
      orders: ordersVendor.length === 0 ? null : ordersVendor,
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
