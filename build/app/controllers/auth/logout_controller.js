export default class LogoutController {
    async handle({ response, auth }) {
        await auth.use('web').logout();
        return response.redirect().toPath('/');
    }
}
//# sourceMappingURL=logout_controller.js.map