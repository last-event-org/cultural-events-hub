import Order from '#models/order'
import OrderLine from '#models/order_line'
import Price from '#models/price'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
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

  async addQuantity(id: number) {}

  /**
   * Remove 1pc
   */
  async removeQuantity(id: number) {}

  /**
   * Confirm order
   */
  async confirmOrder() {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, request, response }: HttpContext) {
    let order = await Order.find(request.cookie('orderId'))
    order?.delete()
    return response.redirect().toRoute('home')
  }
}
