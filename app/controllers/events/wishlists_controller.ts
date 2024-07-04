import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Media from '#models/media'

export default class WishlistsController {

    async index({ view, response, auth }: HttpContext) {
        const user = auth.user

        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        const userWishlist = await user.related('wishlistEvents')
            .query()
            .preload('location')
            .preload('media')

        return view.render('pages/dashboard/my-wishlist', { userWishlist: userWishlist })
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

        // const alreadyWishlisted = await event
        //     .related('usersWhoWishlisted')
        //     .query()
        //     .where('user_id', user.id)
        //     .first()

        // if (alreadyWishlisted) {
        //     return response.status(400).json({ message: 'Event is already in your wishlist' })
        // }

        if (user) await event.related('usersWhoWishlisted').attach([user.id])

        return response.redirect().back();
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

        const alreadyWishlisted = await event
            .related('usersWhoWishlisted')
            .query()
            .where('user_id', user.id)
            .first()

        if (!alreadyWishlisted) {
            return response.status(400).json({ message: 'Event is not in your wishlist' })
        }

        if (user) await event.related('usersWhoWishlisted').detach([user.id])

        return response.redirect().back();
    }
}