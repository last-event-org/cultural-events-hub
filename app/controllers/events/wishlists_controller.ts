import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'

export default class WishlistsController {

    async index({ view, response, auth }: HttpContext) {
        const user = auth.user

        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        const userWishlist = await user.related('wishlistEvents')
            .query()
            .preload('location')

        return view.render('pages/events/my-wishlist', { userWishlist: userWishlist })
    }

    async addToWishlist({ params, response, auth }: HttpContext) {

        const user = auth.user
        const event = await Event.find(params.id)

        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        if (!event) {
            return response.status(404).json({ message: 'Event not found' })
        }

        if (user) await event.related('usersWhoWishlisted').attach([user.id])

        return response.redirect().toRoute('events.show', { id: event })
    }

    async destroy({ params, response, auth }: HttpContext) {
        const user = auth.user
        const event = await Event.find(params.id)

        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }

        if (!event) {
            return response.status(404).json({ message: 'Event not found' })
        }
        
        if (user) await event.related('usersWhoWishlisted').detach([user.id])
        
        return response.redirect().toRoute('wishlist.index')
    }
}