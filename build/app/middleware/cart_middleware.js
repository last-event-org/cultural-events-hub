export default class CartMiddleware {
    async handle({ auth, view }, next) {
        if (await auth.check()) {
            const user = await auth.user;
            if (user) {
                const hasOrder = await user.related('order').query().where('is_paid', 'false');
                view.share({ userHasOrder: hasOrder.length > 0 ? true : false });
            }
            else {
                view.share({ userHasOrder: false });
            }
        }
        await next();
    }
}
//# sourceMappingURL=cart_middleware.js.map