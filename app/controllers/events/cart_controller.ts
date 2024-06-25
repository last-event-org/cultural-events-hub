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
  async index({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, params, auth, session }: HttpContext) {
    await auth.check()
    console.log('ADD PRICE TO ORDER')

    // TODO put the db query in the model
    let order = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', 'false')
    console.log('ORDER')
    console.log(order)

    let price = await Price.find(request.input('price_id'))
    const orderLine = new OrderLine()
    orderLine.qty = 1
    if (price !== null) {
      orderLine.priceId = price.id
      await orderLine.save()
    }

    let user = await User.find(auth.user?.$attributes.id)
    console.log('USER')
    console.log(user)

    if (order?.length === 0) {
      let newOrder = await new Order()
      newOrder.userId = user.id
      newOrder = await newOrder.save()
      console.log('NEW ORDER')
      orderLine.orderId = newOrder.id
      response.cookie('orderId', newOrder.id)
      await orderLine.save()
    } else {
      console.log('ORDER EXISTS')
      orderLine.orderId = order[0].id
      await orderLine.save()

      response.cookie('orderId', order[0].id)
    }

    session.flash('item-added', {
      message: 'Article ajouté au panier',
    })

    // TODO avoid refreshing the page or go back
    return response.redirect().back()
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

    console.log(order)
    return view.render('pages/cart/show', {
      order: order,
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
   * Remove 1pc
   */
  async deleteOrderLine({ params, response }: HttpContext) {
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
    console.log('CONFIRM ORDER')
    console.log(params['id'])
    const order = await Order.find(params['id'])

    // TODO update quantities in prices

    if (order) {
      order.isPaid = true
      order.purchaseDate = DateTime.now()
      await order?.save()
      response.clearCookie('orderId')
    }

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    console.log('DESTROY')
    console.log(params)
    let order = await Order.find(params['id'])
    await order?.delete()
    response.clearCookie('orderId')
    return response.redirect().toRoute('cart.show')
  }
}
