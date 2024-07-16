import Role from '#models/role';
import User from '#models/user';
export default class AdminController {
    async index({ view, response, auth }) {
        if (!(await auth.user?.isAdmin())) {
            return response.redirect().toRoute('home');
        }
        return view.render('pages/dashboard/admin/admin-panel');
    }
    async search({ view, request, response, auth }) {
        if (!(await auth.user?.isAdmin())) {
            return response.redirect().toRoute('home');
        }
        const input = request.qs();
        let array = input.input_words.split(' ');
        let result = array.reduce((acc, current) => acc + current + `%`, `%`);
        let users;
        if (input.input_words) {
            users = await User.query()
                .select('id', 'firstname', 'lastname', 'is_blocked', 'is_verified', 'email', 'role_id', 'company_name')
                .preload('role', (roleQuery) => roleQuery.select('id', 'role_name'))
                .where((user) => {
                user
                    .whereILike('firstname', `%${result}%`)
                    .orWhereILike('lastname', `%${result}%`)
                    .orWhereILike('company_name', `%${result}%`)
                    .orWhereILike('email', `%${result}%`);
            })
                .distinct();
            return view.render('pages/dashboard/admin/admin-panel', {
                users: users.length === 0 ? null : users,
                searchParams: request.qs().input_words,
            });
        }
        return response.redirect().toRoute('admin.index');
    }
    async block({ request, response, params, session, auth, i18n }) {
        if (!(await auth.user?.isAdmin())) {
            return response.redirect().toRoute('home');
        }
        if (auth.user.id == params.id) {
            const errorMsg = i18n.t('messages.errorAdminSameUser');
            session.flash('error', errorMsg);
        }
        else {
            try {
                const user = await User.findOrFail(params.id);
                console.log('USER CURRENT');
                console.log(user.isBlocked);
                if (user.isBlocked) {
                    user.isBlocked = false;
                    const successMsg = i18n.t('messages.successUnblockUser');
                    session.flash('success', successMsg);
                }
                else {
                    user.isBlocked = true;
                    const successMsg = i18n.t('messages.successBlockUser');
                    session.flash('success', successMsg);
                }
                await user.save();
            }
            catch (error) {
                console.log(error);
                const errorMsg = i18n.t('messages.errorBlockUser');
                session.flash('error', errorMsg);
            }
        }
        const searchParams = request.input('searchParams', {});
        const queryString = new URLSearchParams(searchParams).toString();
        return response.redirect().toPath(`/dashboard/admin/search?${queryString}`);
    }
    async admin({ request, response, params, auth, session, i18n }) {
        if (!(await auth.user?.isAdmin())) {
            return response.redirect().toRoute('home');
        }
        if (auth.user.id == params.id) {
            const errorMsg = i18n.t('messages.errorAdminSameUser');
            session.flash('error', errorMsg);
        }
        else {
            try {
                const user = await User.findOrFail(params.id);
                const adminRole = await Role.query().where('role_name', 'ADMIN').select('id').first();
                if (adminRole) {
                    if (user.roleId === adminRole.id) {
                        if (user.billingAddressId === null) {
                            const userRole = await Role.query().where('role_name', 'USER').select('id').first();
                            user.roleId = userRole.id;
                            await user.save();
                        }
                        else {
                            const vendorRole = await Role.query()
                                .where('role_name', 'VENDOR')
                                .select('id')
                                .first();
                            user.roleId = vendorRole.id;
                            await user.save();
                        }
                        const successMsg = i18n.t('messages.successRemoveAdmin');
                        session.flash('success', successMsg);
                    }
                    else {
                        user.roleId = adminRole.id;
                        await user.save();
                        const successMsg = i18n.t('messages.successGrantAdmin');
                        session.flash('success', successMsg);
                    }
                }
            }
            catch (error) {
                const errorMsg = i18n.t('messages.errorAdminRights');
                session.flash('error', errorMsg);
            }
            const searchParams = request.input('searchParams', {});
            const queryString = new URLSearchParams(searchParams).toString();
            return response.redirect().toPath(`/dashboard/admin/search?${queryString}`);
        }
    }
    async destroy({ request, response, params, session, auth, i18n }) {
        if (!(await auth.user?.isAdmin())) {
            return response.redirect().toRoute('home');
        }
        if (auth.user.id == params.id) {
            const errorMsg = i18n.t('messages.errorAdminSameUser');
            session.flash('error', errorMsg);
        }
        else {
            try {
                const user = await User.findOrFail(params.id);
                await user.delete();
                const successMsg = i18n.t('messages.successDeleteUser');
                session.flash('success', successMsg);
            }
            catch (error) {
                const errorMsg = i18n.t('messages.errorDeleteUser');
                session.flash('error', errorMsg);
            }
        }
        const searchParams = request.input('searchParams', {});
        const queryString = new URLSearchParams(searchParams).toString();
        return response.redirect().toPath(`/dashboard/admin/search?${queryString}`);
    }
}
//# sourceMappingURL=admin_controller.js.map