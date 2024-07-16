import Price from '#models/price';
export default class PriceController {
    async destroy({ response, params, i18n, session }) {
        try {
            const price = await Price.findOrFail(params['id']);
            await price.delete();
        }
        catch (error) {
            console.log(error);
            const errorMsg = i18n.t('messages.errorDestroyPrice');
            session.flash('error', errorMsg);
        }
        response.redirect().back();
    }
}
//# sourceMappingURL=price_controller.js.map