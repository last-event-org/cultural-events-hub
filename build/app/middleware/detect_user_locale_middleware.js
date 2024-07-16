import { I18n } from '@adonisjs/i18n';
import i18nManager from '@adonisjs/i18n/services/main';
import { RequestValidator } from '@adonisjs/core/http';
export default class DetectUserLocaleMiddleware {
    static {
        RequestValidator.messagesProvider = (ctx) => {
            return ctx.i18n.createMessagesProvider();
        };
    }
    getRequestLocale(ctx) {
        const supportedLocales = i18nManager.supportedLocales();
        const queryLocale = ctx.request.input('locale');
        if (queryLocale && supportedLocales.includes(queryLocale)) {
            ctx.response.cookie('frontend_lang', queryLocale, { path: '/' });
            return queryLocale;
        }
        const cookieLocale = ctx.request.cookie('frontend_lang');
        if (cookieLocale && supportedLocales.includes(cookieLocale)) {
            return cookieLocale;
        }
        const userLanguages = ctx.request.languages();
        const localeFromHeader = i18nManager.getSupportedLocaleFor(userLanguages);
        if (localeFromHeader) {
            return localeFromHeader;
        }
        return i18nManager.defaultLocale;
    }
    async handle(ctx, next) {
        const language = this.getRequestLocale(ctx);
        ctx.i18n = i18nManager.locale(language || i18nManager.defaultLocale);
        ctx.containerResolver.bindValue(I18n, ctx.i18n);
        if ('view' in ctx) {
            ctx.view.share({ i18n: ctx.i18n });
        }
        return next();
    }
}
//# sourceMappingURL=detect_user_locale_middleware.js.map