import app from '@adonisjs/core/services/app';
import { errors } from '@adonisjs/core';
import { ExceptionHandler } from '@adonisjs/core/http';
export default class HttpExceptionHandler extends ExceptionHandler {
    debug = !app.inProduction;
    renderStatusPages = app.inProduction;
    statusPages = {
        '404': (error, { view }) => {
            return view.render('pages/errors/not_found', { error });
        },
        '500..599': (error, { view }) => {
            return view.render('pages/errors/server_error', { error });
        },
    };
    async handle(error, ctx) {
        if (error instanceof errors.E_ROUTE_NOT_FOUND) {
            return ctx.view.render('pages/errors/not_found');
        }
        return super.handle(error, ctx);
    }
    async report(error, ctx) {
        return super.report(error, ctx);
    }
}
//# sourceMappingURL=handler.js.map