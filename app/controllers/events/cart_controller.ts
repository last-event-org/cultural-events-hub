import Order from '#models/order'
import OrderLine from '#models/order_line'
import Price from '#models/price'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

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
    console.log('STORE CART')

    // check if a non-paid order already exists for the user
    let order = await Order.query()
      .where('user_id', '=', auth.user?.$attributes.id)
      .andWhere('is_paid', '=', false)

    let price = await Price.find(request.input('price_id'))
    console.log(order)
    // if there is no non-paid order create a new order
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
      // if there is a non-paid order
    } else {
      const orderLineExists = await OrderLine.query()
        .where('orderId', '=', order[0].id)
        .andWhere('priceId', '=', price.id)
        .preload('price')
      // if there is already an order line with the price id
      if (orderLineExists.length !== 0) {
        console.log('orderLineExists[0]')
        console.log(orderLineExists[0].qty)
        // all available Qty already taken by
        if (orderLineExists[0].qty === orderLineExists[0].price.availableQty) {
          console.log('NOT POSSIBLE TO ADD MORE QUANTITY')
          // TODO handle error message
          return response.send('')
        } else {
          // if the available qty > 0
          if (orderLineExists[0].price.availableQty > 0) {
            console.log('ADD QUANTITY')
            orderLineExists[0].qty += 1
            orderLineExists[0].save()

            // if the available qty = 0
          } else {
            // TODO handle error message
            console.log('NO AVAILABLE QTY')
            return response.send('')
          }
        }

        // if there is no order line with the price id
      } else {
        const orderLine = new OrderLine()
        orderLine.orderId = order[0].id
        orderLine.qty = 1

        price ? (orderLine.priceId = price.id) : ''
        response.cookie('orderId', order[0].id)
        await orderLine.save()
      }
    }

    // TODO avoid refreshing the page or go back
    return response.send('')
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

  async addQuantity({ params, response, i18n, session }: HttpContext) {
    console.log('ADD QUANTITY')

    let orderLine = await OrderLine.find(params['id'])
    let orderLinePrice = await orderLine?.related('price').query().first()
    if (orderLine && orderLinePrice) {
      if (orderLine.qty === orderLinePrice.availableQty) {
        // const successMsg = i18n.t('messages.cart_itemDeleted')
        const errorMsg = 'There is no other places available'
        session.flash('error', errorMsg)
      } else {
        orderLine.qty += 1
        orderLine?.save()
        const successMsg = i18n.t('messages.cart_itemAdded')
        session.flash('success', successMsg)
      }
    }

    return response.redirect().toRoute('cart.show')
  }

  /**
   * Remove 1pc
   */
  async removeQuantity({ params, session, i18n, response }: HttpContext) {
    console.log('REMOVE QUANTITY')

    const orderLine = await OrderLine.find(params['id'])
    if (orderLine) {
      if (orderLine.qty === 1) {
        orderLine.delete()
        const successMsg = i18n.t('messages.cart_itemDeleted')
        session.flash('success', successMsg)
        return response.redirect().toRoute('cart.show')
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
  async deleteOrderLine({ params, i18n, session, response }: HttpContext) {
    console.log('DELETE ORDER LINE')

    const orderLine = await OrderLine.find(params['id'])
    orderLine?.delete()

    // TODO configure the response
    const successMsg = i18n.t('messages.cart_itemDeleted')
    session.flash('success', successMsg)
    return response.redirect().toRoute('cart.show')
  }

  /**
   * Confirm order
   */
  async confirmOrder({ params, response, session, i18n }: HttpContext) {
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
      const cartValidated = i18n.t('messages.successValidatedCart')
      session.flash('cartValidated', cartValidated)
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
  async destroy({ params, response, session, i18n }: HttpContext) {
    try {
      let order = await Order.find(params['id'])
      await order?.delete()
      response.clearCookie('orderId')
    } catch (error) {
      const cartDestroyed = i18n.t('messages.errorDestroyCart')
      session.flash('error', cartDestroyed)
      return response.redirect().toRoute('cart.show')
    }
    const cartDestroyed = i18n.t('messages.successDestroyCart')
    session.flash('success', cartDestroyed)
    response.clearCookie('orderId')
    return response.redirect().toRoute('cart.show')
  }
}
