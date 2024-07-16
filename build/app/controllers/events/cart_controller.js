import Order from '#models/order';
import OrderLine from '#models/order_line';
import Price from '#models/price';
import User from '#models/user';
import { DateTime } from 'luxon';
export default class CartController {
    async index({ view, auth }) {
        await auth.check();
        let orders = await Order.query()
            .where('user_id', '=', auth.user?.$attributes.id)
            .andWhere('is_paid', '=', true)
            .preload('orderLineId', (query) => query.preload('price', (priceQuery) => priceQuery.preload('event')));
        return view.render('pages/dashboard/orders', { orders: orders });
    }
    async store({ request, response, auth, session }) {
        await auth.check();
        let order = await Order.query()
            .where('user_id', '=', auth.user?.$attributes.id)
            .andWhere('is_paid', '=', false);
        let price = await Price.find(request.input('price_id'));
        if (order.length === 0) {
            let newOrder = await new Order();
            let user = await User.find(auth.user?.$attributes.id);
            newOrder.userId = user?.id;
            await newOrder.save();
            const orderLine = new OrderLine();
            orderLine.qty = 1;
            orderLine.orderId = newOrder.id;
            price ? (orderLine.priceId = price.id) : '';
            response.cookie('orderId', newOrder.id);
            await orderLine.save();
        }
        else {
            const orderLineExists = await OrderLine.query()
                .where('orderId', '=', order[0].id)
                .andWhere('priceId', '=', price.id);
            if (orderLineExists.length !== 0) {
                orderLineExists[0].qty += 1;
                orderLineExists[0].save();
            }
            else {
                const orderLine = new OrderLine();
                orderLine.orderId = order[0].id;
                orderLine.qty = 1;
                price ? (orderLine.priceId = price.id) : '';
                response.cookie('orderId', order[0].id);
                await orderLine.save();
            }
        }
        session.flash('item-added', {
            message: 'Article ajouté au panier',
        });
        return response.send('');
    }
    async show({ params, auth, view }) {
        await auth.check();
        let order = await Order.query()
            .where('user_id', '=', auth.user?.$attributes.id)
            .andWhere('is_paid', '=', 'false')
            .preload('orderLineId', (query) => {
            query.preload('price', (priceQuery) => {
                priceQuery.preload('event');
            });
        })
            .first();
        const totalOrder = order?.orderLineId.reduce((acc, line) => acc + line.price.discountedPrice * line.qty, 0);
        return view.render('pages/cart/show', {
            order: order,
            totalOrder: totalOrder,
        });
    }
    async addQuantity({ params, view, response, request }) {
        console.log('ADD QUANTITY');
        const orderLine = await OrderLine.find(params['id']);
        if (orderLine) {
            orderLine.qty += 1;
            orderLine?.save();
        }
        return response.send();
    }
    async removeQuantity({ params, auth, view, response }) {
        console.log('REMOVE QUANTITY');
        const orderLine = await OrderLine.find(params['id']);
        if (orderLine) {
            if (orderLine.qty === 1) {
                orderLine.delete();
            }
            else {
                orderLine.qty -= 1;
                orderLine?.save();
            }
        }
        return response.send();
    }
    async deleteOrderLine({ params, auth, view, response }) {
        console.log('DELETE ORDER LINE');
        const orderLine = await OrderLine.find(params['id']);
        orderLine?.delete();
        return response.send();
    }
    async confirmOrder({ params, response, session, i18n }) {
        const order = await Order.query()
            .where('id', '=', params['id'])
            .preload('orderLineId', (orderLineQuery) => {
            orderLineQuery.preload('price', (priceQuery) => {
                priceQuery.preload('event');
            });
        })
            .first();
        if (order) {
            order.orderLineId.forEach(async (orderLine) => {
                const price = await Price.find(orderLine.priceId);
                if (price) {
                    if (orderLine.qty > price.availableQty) {
                    }
                    else {
                        price.availableQty -= orderLine.qty;
                        price?.save();
                    }
                }
            });
            order.isPaid = true;
            order.purchaseDate = DateTime.now();
            await order?.save();
            const cartValidated = i18n.t('messages.successValidatedCart');
            session.flash('cartValidated', cartValidated);
            response.clearCookie('orderId');
        }
        return response.redirect().toRoute('cart.show');
    }
    async destroy({ params, response, session, i18n }) {
        try {
            let order = await Order.find(params['id']);
            await order?.delete();
            response.clearCookie('orderId');
        }
        catch (error) {
            const cartDestroyed = i18n.t('messages.errorDestroyCart');
            session.flash('error', cartDestroyed);
            return response.redirect().toRoute('cart.show');
        }
        const cartDestroyed = i18n.t('messages.successDestroyCart');
        session.flash('success', cartDestroyed);
        response.clearCookie('orderId');
        return response.redirect().toRoute('cart.show');
    }
}
//# sourceMappingURL=cart_controller.js.map