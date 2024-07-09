import env from '#start/env'
import { DateTime } from 'luxon'
import fs from 'fs'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { errors } from '@vinejs/vine'

import Event from '#models/event'
import Category from '#models/category'
import CategoryType from '#models/category_type'
import Address from '#models/address'
import Price from '#models/price'
import Media from '#models/media'
import Indicator from '#models/indicator'

import { createEventValidator } from '#validators/event'
import { createAddressValidator } from '#validators/address'
import { createMediaValidator } from '#validators/media'
import { createPricesValidator } from '#validators/price'
import { queryValidator } from '#validators/query'
import User from '#models/user'
import { updatePricesValidator } from '#validators/update_price'
import { error } from 'console'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Order from '#models/order'

export default class VendorController {
  async orders({ view, auth }: HttpContext) {
    await auth.check()

    // get all events with tickets up to now
    const orders = await Order.query().preload('orderLineId', (orderLineQuery) =>
      orderLineQuery
        .preload('price', (priceQuery) =>
          priceQuery.preload('event', (eventQuery) => eventQuery.where('vendor_id', auth.user.id))
        )
        .preload('user')
    )

    console.log(orders)

    return view.render('pages/dashboard/vendor/orders', {
      orders: orders.length === 0 ? null : orders,
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

  /**
   * Show individual record
   */
  async show({ view, params, session, response, auth }: HttpContext) {
    await auth.check()

    let isUserFavourite = false
    let isInUserWishlist = false
    let linkedEvents

    try {
      const event = await Event.query()
        .where('id', '=', params.id)
        .preload('location')
        .preload('categoryTypes', (categoryTypesQuery) => {
          categoryTypesQuery.preload('category')
        })
        .preload('indicators')
        .preload('prices')
        .preload('media')
        .preload('vendor')
        .first()

      // If the User is authenticated
      if (event) {
        const user = auth.user
        if (user) {
          // we check if the Vendor is already on user favourites
          const userFavourites = await user
            .related('favouritesUser')
            .query()
            .where('vendor_id', event.vendorId)

          isUserFavourite = userFavourites.length > 0

          // we check if the event is already on user wishlist
          const alreadyWishlisted = await event
            .related('usersWhoWishlisted')
            .query()
            .where('user_id', user.id)
            .first()

          if (alreadyWishlisted) isInUserWishlist = true
        }

        linkedEvents = await Event.query()
          .select('location_id', 'id', 'title', 'event_start', 'event_end')
          .preload('location', (locationQuery) => locationQuery.select('name', 'city'))
          .preload('categoryTypes', (categoryTypesQuery) => {
            categoryTypesQuery
              .preload('category', (categoryQuery) => {
                categoryQuery.where('id', event.categoryTypes[0].category.id).select('id')
              })
              .select('id', 'category_id')
          })
          .preload('media', (mediaQuery) => mediaQuery.select('id', 'path', 'alt_name'))
          .limit(5)

        console.log('\n\n LINKEDEVENTS \n\n')
        console.log(linkedEvents)
      }

      if (!event) {
        response.redirect().back()
      } else {
        session.forget('item-added')
        return view.render('pages/events/details', {
          event: event,
          linkedEvents: linkedEvents,
          isUserFavourite: isUserFavourite,
          isInUserWishlist: isInUserWishlist,
        })
      }
    } catch (error) {
      if (error) {
        console.error('Price Validation Error at createEventPrices():', error)
        response.redirect().back()
      }
    }
  }
}
