import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class FavouritesController {
  async index({ view, response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    const userFavourites = await user
      .related('favouritesUser')
      .query()
      .preload('favouritesVendor', (query) => {
        query.select(['id', 'companyName'])
      })

    let vendorIds = userFavourites.map((e) => e.id)
    console.log('userIds')
    console.log(vendorIds)

    let date = DateTime.now()
    let dayBegin: string = date.set({ hour: 0, minute: 0, second: 0 }).toSQLDate() ?? ''
    let dayEnd: string = date.plus({ days: 7 }).toSQLDate() ?? ''

    const nextEventsVendors = await Event.query()
      .select('users.id as user_id')
      .join('users', 'events.vendor_id', 'users.id')
      .count('events.id as count_events')
      .whereBetween('events.event_start', [dayBegin, dayEnd])
      .whereIn('users.id', vendorIds)
      .groupBy('user_id')

    const allEventsVendors = await Event.query()
      .select('users.id as user_id')
      .join('users', 'events.vendor_id', 'users.id')
      .count('events.id as count_events')
      .whereIn('users.id', vendorIds)
      .groupBy('user_id')

    console.log(nextEventsVendors)
    console.log(allEventsVendors)

    let vendorEvents = {}
    vendorIds.forEach((vendor) => {
      if (!vendorEvents[vendor]) {
        vendorEvents[vendor] = { nextEvents: 0, allEvents: 0 }
      }
    })

    nextEventsVendors.forEach((vendor) => {
      vendorEvents[vendor.$extras.user_id].nextEvents = vendor.$extras.count_events
    })

    allEventsVendors.forEach((vendor) => {
      vendorEvents[vendor.$extras.user_id].allEvents = vendor.$extras.count_events
    })

    return view.render('pages/dashboard/my-favourites', {
      userFavourites: userFavourites,
      vendorEvents: vendorEvents,
    })
  }

  async addToFavourites({ params, response, auth }: HttpContext) {
    const user = auth.user
    const vendor = await User.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    if (!vendor) {
      return response.status(404).json({ message: 'Vendor not found' })
    }

    if (user) await vendor.related('favouritesVendor').attach([user.id])

    return response.redirect().back()
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user
    const vendor = await User.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    if (!vendor) {
      return response.status(404).json({ message: 'Vendor not found' })
    }

    const alreadyFavourite = await vendor
      .related('favouritesVendor')
      .query()
      .where('user_id', user.id)
      .first()

    if (!alreadyFavourite) {
      return response.status(400).json({ message: 'Vendor is not in your wishlist' })
    }

    if (user) await vendor.related('favouritesVendor').detach([user.id])

    return response.redirect().back()
  }
}
