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
          eventQuery.where('vendor_id', auth.user.id)
        })
      })
      .preload('order', (orderQuery) => {
        orderQuery.preload('user')
      })
      .preload('price', (priceQuery) => {
        priceQuery.preload('event')
      })
      .limit(2)

    // let ordersVendor = await OrderLine.query()
    //   .whereHas('order', { where: { is_paid: true } }) // Assuming 'order' relation is correctly defined
    //   .andWhereHas('price', (builder) => {
    //     builder.preload('event', (eventBuilder) => {
    //       eventBuilder.whereHas('vendor_id', function () {
    //         this.whereColumn('id', '=', auth.user.id) // Adjusted to match Laravel's syntax
    //       })
    //     })
    //   })
    //   .preload('order', { preload: ['user'] }) // Preloading nested relations
    //   .preload('price')
    //   .limit(2)

    // let ordersVendor = await OrderLine.query()
    //   .select('id', 'order_id')
    //   .preload('order', (query) => {
    //     query.where('is_paid', '=', 1)
    //   })

    // let paidOrders = await Order.query().where('is_paid', '=', true).select('id')
    // console.log(paidOrders)

    // let orders = await Order.query()
    //   .andWhere('is_paid', '=', true)
    //   .preload('orderLineId', (orderLineQuery) =>
    //     orderLineQuery.preload('price', (priceQuery) =>
    //       priceQuery.preload('event', (eventQuery) => eventQuery.andWhere('vendor_id', '=', userId))
    //     )
    //   )
    // .preload('user')

    // let orders = await Order.query().andWhere('is_paid', '=', true)

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
