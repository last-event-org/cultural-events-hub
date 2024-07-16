import User from '#models/user';
import Event from '#models/event';
import { DateTime } from 'luxon';
export default class FavouritesController {
    async index({ view, response, auth }) {
        const user = auth.user;
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }
        const userFavourites = await user
            .related('favouritesUser')
            .query()
            .preload('favouritesVendor', (query) => {
            query.select(['id', 'companyName']);
        });
        let vendorIds = userFavourites.map((e) => e.id);
        let date = DateTime.now();
        let dayBegin = date.set({ hour: 0, minute: 0, second: 0 }).toSQLDate() ?? '';
        let dayEnd = date.plus({ days: 7 }).toSQLDate() ?? '';
        const nextEventsVendors = await Event.query()
            .select('users.id as user_id')
            .join('users', 'events.vendor_id', 'users.id')
            .count('events.id as count_events')
            .whereBetween('events.event_start', [dayBegin, dayEnd])
            .whereIn('users.id', vendorIds)
            .groupBy('user_id');
        const allEventsVendors = await Event.query()
            .select('users.id as user_id')
            .join('users', 'events.vendor_id', 'users.id')
            .count('events.id as count_events')
            .whereIn('users.id', vendorIds)
            .groupBy('user_id');
        let vendorEvents = {};
        vendorIds.forEach((vendor) => {
            if (!vendorEvents[vendor]) {
                vendorEvents[vendor] = { nextEvents: 0, allEvents: 0 };
            }
        });
        nextEventsVendors.forEach((vendor) => {
            vendorEvents[vendor.$extras.user_id].nextEvents = vendor.$extras.count_events;
        });
        allEventsVendors.forEach((vendor) => {
            vendorEvents[vendor.$extras.user_id].allEvents = vendor.$extras.count_events;
        });
        return view.render('pages/dashboard/my-favourites', {
            userFavourites: userFavourites,
            vendorEvents: vendorEvents,
        });
    }
    async addToFavourites({ params, response, auth, session, i18n }) {
        const user = auth.user;
        const vendor = await User.find(params.id);
        if (!user) {
            const errorMsg = i18n.t('messages.errorAddFavourite');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'User not found' });
        }
        if (!vendor) {
            const errorMsg = i18n.t('messages.errorAddFavourite');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'Vendor not found' });
        }
        const successMsg = i18n.t('messages.successAddFavourite');
        session.flash('success', successMsg);
        if (user)
            await vendor.related('favouritesVendor').attach([user.id]);
        return response.redirect().back();
    }
    async destroy({ params, response, auth, session, i18n }) {
        const user = auth.user;
        const vendor = await User.find(params.id);
        if (!user) {
            const errorMsg = i18n.t('messages.errorDestroyFavourite');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'User not found' });
        }
        if (!vendor) {
            const errorMsg = i18n.t('messages.errorDestroyFavourite');
            session.flash('error', errorMsg);
            return response.status(404).json({ message: 'Vendor not found' });
        }
        const alreadyFavourite = await vendor
            .related('favouritesVendor')
            .query()
            .where('user_id', user.id)
            .first();
        if (!alreadyFavourite) {
            const errorMsg = i18n.t('messages.errorDestroyFavourite');
            session.flash('error', errorMsg);
            return response.status(400).json({ message: 'Vendor is not in your wishlist' });
        }
        const successMsg = i18n.t('messages.successDestroyFavourite');
        session.flash('success', successMsg);
        if (user)
            await vendor.related('favouritesVendor').detach([user.id]);
        return response.redirect().back();
    }
}
//# sourceMappingURL=favourites_controller.js.map