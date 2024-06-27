import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class FavouritesController {

    async index({ view, response, auth }: HttpContext) {
        const user = auth.user

        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        const userFavourites = await user.related('favouritesUser')
            .query()
            .preload('favouritesVendor', (query) => {
                query.select(['id', 'companyName'])
              })

        return view.render('pages/dashboard/my-favourites', { userFavourites: userFavourites })
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

        const alreadyWishlisted = await vendor
            .related('favouritesVendor')
            .query()
            .where('user_id', user.id)
            .first()

        if (alreadyWishlisted) {
            return response.status(400).json({ message: 'Vendor is already in your wishlist' })
        }

        if (user) await vendor.related('favouritesVendor').attach([user.id])

        return response.redirect().back();
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

        return response.redirect().back();
    }
}