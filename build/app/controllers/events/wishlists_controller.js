import Event from '#models/event';
export default class WishlistsController {
    async index({ view, response, auth }) {
        const user = auth.user;
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }
        const userWishlist = await user
            .related('wishlistEvents')
            .query()
            .preload('location')
            .preload('media');
        return view.render('pages/dashboard/my-wishlist', { userWishlist: userWishlist });
    }
    async addToWishlist({ params, response, auth, session, i18n }) {
        const user = auth.user;
        const event = await Event.find(params.id);
        if (!user) {
            const errorMsg = i18n.t('messages.errorAddWishlist');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'User not found' });
        }
        if (!event) {
            const errorMsg = i18n.t('messages.errorAddWishlist');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'Event not found' });
        }
        const successMsg = i18n.t('messages.successAddWishlist');
        session.flash('success', successMsg);
        if (user)
            await event.related('usersWhoWishlisted').attach([user.id]);
        return response.redirect().back();
    }
    async destroy({ params, response, auth, session, i18n }) {
        const user = auth.user;
        const event = await Event.find(params.id);
        if (!user) {
            const errorMsg = i18n.t('messages.errorDestroyWishlist');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'User not found' });
        }
        if (!event) {
            const errorMsg = i18n.t('messages.errorDestroyWishlist');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'Event not found' });
        }
        const alreadyWishlisted = await event
            .related('usersWhoWishlisted')
            .query()
            .where('user_id', user.id)
            .first();
        if (!alreadyWishlisted) {
            const errorMsg = i18n.t('messages.errorDestroyWishlist');
            session.flash('error', errorMsg);
            return response.status(400).json({ message: 'Event is not in your wishlist' });
        }
        const successMsg = i18n.t('messages.successDestroyWishlist');
        session.flash('success', successMsg);
        if (user)
            await event.related('usersWhoWishlisted').detach([user.id]);
        return response.redirect().back();
    }
}
//# sourceMappingURL=wishlists_controller.js.map