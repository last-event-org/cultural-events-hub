import Order from '#models/order'
import OrderLine from '#models/order_line'
import Price from '#models/price'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { document } from 'postcss'

export default class CartController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    await auth.check()
    let orders = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', true)
      .preload('orderLineId', (query) =>
        query.preload('price', (priceQuery) => priceQuery.preload('event'))
      )
    // console.log(orders)
    return view.render('pages/dashboard/orders', { orders: orders })
  }

  /**
   * Add ticket to the cart
   */
  async store({ request, response, auth, session }: HttpContext) {
    await auth.check()

    // TODO check if all the queries couldn't be added to the model

    // check if a non-paid order already exists for the user
    let order = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', false)

    let price = await Price.find(request.input('price_id'))

    if (order.length === 0) {
      let newOrder = await new Order()
      let user = await User.find(auth.user?.$attributes.id)

      newOrder.userId = user?.id
      await newOrder.save()

      const orderLine = new OrderLine()
      orderLine.qty = 1
      orderLine.orderId = newOrder.id
      price ? (orderLine.priceId = price.id) : ''
      response.cookie('orderId', newOrder.id)
      await orderLine.save()
    } else {
      const orderLineExists = await OrderLine.query()
        .where('orderId', '=', order[0].id)
        .andWhere('priceId', '=', price.id)
      if (orderLineExists.length !== 0) {
        orderLineExists[0].qty += 1
        orderLineExists[0].save()
      } else {
        const orderLine = new OrderLine()
        orderLine.orderId = order[0].id
        orderLine.qty = 1

        price ? (orderLine.priceId = price.id) : ''
        response.cookie('orderId', order[0].id)
        await orderLine.save()
      }
    }
    session.flash('item-added', {
      message: 'Article ajouté au panier',
    })

    // TODO avoid refreshing the page or go back
    return response.send()
  }

  /**
   * Show individual record
   */
  async show({ params, auth, view }: HttpContext) {
    await auth.check()
    let order = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', 'false')
      .preload('orderLineId', (query) => {
        query.preload('price', (priceQuery) => {
          priceQuery.preload('event')
        })
      })
      .first()

    // calculate the total price but will also be calculated in the front
    const totalOrder = order?.orderLineId.reduce(
      (acc, line) => acc + line.price.discountedPrice * line.qty,
      0
    )

    return view.render('pages/cart/show', {
      order: order,
      totalOrder: totalOrder,
    })
  }

  /**
   * Add one 1pc
   */

  async addQuantity({ params, view, response, request }: HttpContext) {
    console.log('ADD QUANTITY')

    const orderLine = await OrderLine.find(params['id'])
    if (orderLine) {
      orderLine.qty += 1
      orderLine?.save()
    }

    // TODO configure the response
    return response.send()
  }

  /**
   * Remove 1pc
   */
  async removeQuantity({ params, auth, view, response }: HttpContext) {
    console.log('REMOVE QUANTITY')

    const orderLine = await OrderLine.find(params['id'])
    if (orderLine) {
      if (orderLine.qty === 1) {
        orderLine.delete()
      } else {
        orderLine.qty -= 1
        orderLine?.save()
      }
    }

    // TODO configure the response
    return response.send()
  }

  /**
   * Remove the order line
   */
  async deleteOrderLine({ params, auth, view, response }: HttpContext) {
    console.log('DELETE ORDER LINE')

    const orderLine = await OrderLine.find(params['id'])
    orderLine?.delete()

    // TODO configure the response
    return response.send()
  }

  /**
   * Confirm order
   */
  async confirmOrder({ params, response }: HttpContext) {
    const order = await Order.query()
      .where('id', '=', params['id'])
      .preload('orderLineId', (orderLineQuery) => {
        orderLineQuery.preload('price', (priceQuery) => {
          priceQuery.preload('event')
        })
      })
      .first()

    if (order) {
      order.orderLineId.forEach(async (orderLine) => {
        const price = await Price.find(orderLine.priceId)
        if (price) {
          if (orderLine.qty > price.availableQty) {
            // TODO handle if ordered qty is > than availableQty
          } else {
            price.availableQty -= orderLine.qty
            price?.save()
          }
        }
      })

      order.isPaid = true
      order.purchaseDate = DateTime.now()
      await order?.save()
      response.clearCookie('orderId')
    }

    return response.redirect().toRoute('cart.show')
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    let order = await Order.find(params['id'])
    await order?.delete()
    response.clearCookie('orderId')
    return response.redirect().toRoute('cart.show')
  }
}
