import Media from '#models/media';
export default class MediaController {
    async destroy({ response, session, i18n, params }) {
        try {
            const media = await Media.findOrFail(params['id']);
            await media.delete();
        }
        catch (error) {
            console.log(error);
            const errorMsg = i18n.t('messages.errorDestroyMedia');
            session.flash('error', errorMsg);
        }
        response.redirect().back();
    }
}
//# sourceMappingURL=media_controller.js.map