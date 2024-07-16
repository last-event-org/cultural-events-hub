import { createRegisterValidator } from '#validators/register';
import { createVendorDataValidator } from '#validators/vendor_data';
import { updateUserProfileMandatoryValidator } from '#validators/user_profile';
import User from '#models/user';
import Role from '#models/role';
import Event from '#models/event';
import { createAddressValidator } from '#validators/address';
import Address from '#models/address';
import { errors } from '@vinejs/vine';
import { randomTokenString, sendAccountVerified, sendVerificationEmail, } from '#services/account_service';
import { DateTime } from 'luxon';
import { tokenValidator } from '#validators/token';
export default class RegistersController {
    async index({ view }) {
        return view.render('pages/auth/register');
    }
    async dashboard({ view, auth }) {
        const user = await User.query()
            .where('id', auth.user?.$attributes.id)
            .preload('role')
            .firstOrFail();
        const userWishlist = await user
            .related('wishlistEvents')
            .query()
            .preload('location')
            .preload('media');
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
        return view.render('pages/dashboard/dashboard', {
            user: user,
            userWishlist: userWishlist,
            userFavourites: userFavourites,
            vendorEvents: vendorEvents,
        });
    }
    async store({ i18n, session, request, response, auth, view }) {
        const payload = await request.validateUsing(createRegisterValidator);
        const lang = i18n.locale;
        const parsedUrl = new URL(request.completeUrl());
        const origin = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const userEmail = await User.findBy('email', payload.email);
        if (userEmail) {
            const errorMsg = i18n.t('messages.register_duplicateEmail');
            session.flash('error', errorMsg);
            return response.redirect().back();
        }
        const token = await randomTokenString();
        console.log(token);
        const user = new User();
        user.firstname = payload.first_name;
        user.lastname = payload.last_name;
        user.email = payload.email;
        user.password = payload.password;
        user.verificationToken = token;
        const role = await Role.findBy('role_name', 'USER');
        if (role) {
            user.roleId = role.id;
        }
        const newUser = await user.save();
        const subject = i18n.t('messages.mail_verify_subject');
        await sendVerificationEmail(user, token, origin, lang, subject);
        if (user.$isPersisted) {
            return view.render('pages/auth/profile-type', {
                user: user,
                id: newUser.$attributes.id,
            });
        }
        else {
            return response.redirect().back();
        }
    }
    async verificationEmailSent({ view }) {
        return view.render('pages/auth/verify_email');
    }
    async verifyUser({ response, request, session, i18n }) {
        console.log('EMAIL VERIFICATION');
        console.log();
        const lang = i18n.locale;
        const parsedUrl = new URL(request.completeUrl());
        const origin = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const data = {
            token: request.qs().token,
        };
        try {
            const { token } = await tokenValidator.validate(data);
            const user = await User.findByOrFail('verificationToken', token);
            user.isVerified = true;
            user.verificationToken = null;
            user.verifiedAt = DateTime.now();
            await user.save();
            const subject = i18n.t('messages.mail_account_activated_subject');
            await sendAccountVerified(user, origin, lang, subject);
            const successMsg = i18n.t('messages.login_verified_success');
            session.flash('success', successMsg);
            return response.redirect().toRoute('auth.login.show');
        }
        catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
            }
            const errorMsg = i18n.t('messages.login_verified_error');
            session.flash('error', errorMsg);
            return response.redirect().toRoute('auth.login.show');
        }
    }
    async switchToVendor({ view }) {
        return view.render('pages/auth/switch-to-vendor');
    }
    async getUserBillingAddress(user) {
        const userBillingAddressId = user.$attributes.billingAddressId;
        if (user && userBillingAddressId) {
            const vendorAddress = await Address.query().where('id', '=', userBillingAddressId).first();
            return vendorAddress;
        }
        return false;
    }
    async updateUserRole(user) {
        console.log('UPDATE USER ROLE');
        const vendorRole = await Role.findBy('role_name', 'VENDOR');
        const adminRole = await Role.findBy('role_name', 'ADMIN');
        const userRole = await Role.findBy('role_name', 'USER');
        const userBillingAddress = await this.getUserBillingAddress(user);
        if (vendorRole && userRole) {
            if (userBillingAddress &&
                userBillingAddress.street &&
                userBillingAddress.number &&
                userBillingAddress.city &&
                userBillingAddress.zipCode &&
                userBillingAddress.country) {
                if (user.roleId !== adminRole.id) {
                    user.roleId = vendorRole.id;
                }
            }
            else {
                user.roleId = userRole.id;
            }
        }
        await user.save();
    }
    async updateMandatoryProfileData(request, session, user) {
        let userProfilePayload = null;
        try {
            userProfilePayload = await request.validateUsing(updateUserProfileMandatoryValidator);
            user.firstname = userProfilePayload.first_name;
            user.lastname = userProfilePayload.last_name;
            user.email = userProfilePayload.email;
        }
        catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
            }
            const errorMsg = 'Les champs Prénom, Nom et Email sont requis';
            session.flash('mandatoryProfileData', errorMsg);
            return false;
        }
        return true;
    }
    async updateUserBillingAddress(request, session, user) {
        let userBillingAddressPayload = null;
        let vendorAddress = await this.getUserBillingAddress(user);
        try {
            userBillingAddressPayload = await request.validateUsing(createVendorDataValidator);
            if (!vendorAddress) {
                vendorAddress = new Address();
            }
            vendorAddress.street = userBillingAddressPayload.street.replaceAll('&#x27;', "'");
            vendorAddress.number = userBillingAddressPayload.number;
            vendorAddress.zipCode = userBillingAddressPayload.zip_code;
            vendorAddress.city = userBillingAddressPayload.city.replaceAll('&#x27;', "'");
            vendorAddress.country = userBillingAddressPayload.country;
            await vendorAddress.save();
            if (user.role.roleName === 'USER' || user.role.roleName === 'ADMIN') {
                user.billingAddressId = vendorAddress.id;
                vendorAddress.userId = user.id;
                await user.related('billingAddress').save(vendorAddress);
            }
        }
        catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
            }
            const errorMsg = "Tous les champs de l'adresse de facturation doivent être complétés";
            session.flash('billingAddressError', errorMsg);
            return false;
        }
        return true;
    }
    async updateVendorData(request, session, response, user) {
        let userVendorDataPayload = null;
        const isVatEntered = request.input('vat_number');
        const isCompanyNameEntered = request.input('company_name');
        const isStreetEntered = request.input('street');
        const isNumberEntered = request.input('number');
        const isZipEntered = request.input('zip_code');
        const isCityEntered = request.input('city');
        const isCountryEntered = request.input('country');
        const billingAddressFields = [
            isStreetEntered,
            isNumberEntered,
            isZipEntered,
            isCityEntered,
            isCountryEntered,
        ];
        if (isVatEntered || isCompanyNameEntered || billingAddressFields.some((field) => field)) {
            if (!(await this.updateUserBillingAddress(request, session, user)))
                return response.redirect().back();
            try {
                userVendorDataPayload = await request.validateUsing(createVendorDataValidator);
                if (userVendorDataPayload.company_name && userVendorDataPayload.company_name.trim() != '') {
                    user.companyName = userVendorDataPayload.company_name;
                }
                else {
                    user.companyName = user.firstname + ' ' + user.lastname;
                }
                user.vatNumber = userVendorDataPayload.vat_number;
                await user.save();
            }
            catch (error) {
                const errorMsg = "Pour devenir Organisateur toutes les données commerciales doivent être complétées (Nom de société, numéro de TVA et l'adresse complète de facturation)";
                session.flash('userVendorData', errorMsg);
                return false;
            }
        }
        return true;
    }
    async update({ request, response, session, auth }) {
        const user = await User.query()
            .where('id', auth.user?.$attributes.id)
            .preload('role')
            .firstOrFail();
        if (user) {
            if (!(await this.updateMandatoryProfileData(request, session, user)))
                return response.redirect().back();
            const hasVendorData = await this.updateVendorData(request, session, response, user);
            if (!hasVendorData)
                return response.redirect().back();
            if (hasVendorData) {
                await this.updateUserRole(user);
            }
            await user.save();
            return response.redirect().toRoute('auth.profile.show');
        }
    }
    async updateProfileType({ request, response, auth }) {
        console.log(request.input('id'));
        console.log(request.qs());
        console.log(request.body());
        const user = await User.findOrFail(request.input('id'));
        try {
            const vendorDataPayload = await request.validateUsing(createVendorDataValidator);
            console.log('vendorDataPayload');
            console.log(vendorDataPayload);
            if (vendorDataPayload.company_name && vendorDataPayload.company_name.trim() !== '') {
                user.companyName = vendorDataPayload.company_name;
            }
            else {
                user.companyName = user.firstname + ' ' + user.lastname;
            }
            user.vatNumber = vendorDataPayload.vat_number;
            await user.save();
        }
        catch (error) {
            console.error('Vendor Validation Error:', error);
        }
        try {
            console.log('addressPayload');
            const addressPayload = await request.validateUsing(createAddressValidator);
            console.log(addressPayload);
            const address = new Address();
            address.street = addressPayload.street.replaceAll('&#x27;', "'");
            address.number = addressPayload.number;
            address.zipCode = addressPayload.zip_code;
            address.city = addressPayload.city.replaceAll('&#x27;', "'");
            address.country = addressPayload.country;
            address.name = user.companyName ?? '';
            await address.save();
            user.billingAddressId = address.id;
            await user.related('billingAddress').save(address);
            const vendorRole = await Role.findBy('role_name', 'VENDOR');
            const adminRole = await Role.findBy('role_name', 'ADMIN');
            if (user.roleId !== adminRole?.id) {
                if (vendorRole) {
                    user.roleId = vendorRole.id;
                }
            }
            await user.save();
            return response.redirect().toRoute('auth.register.verify.show');
        }
        catch (error) {
            console.error('Validation Error:', error);
            return response.redirect().toRoute('auth.register.update-profile-type');
        }
    }
    async show({ auth, view }) {
        let user = await User.query()
            .where('id', auth.user?.$attributes.id)
            .preload('role')
            .firstOrFail();
        try {
            user = await User.query()
                .where('id', auth.user?.$attributes.id)
                .preload('billingAddress')
                .firstOrFail();
        }
        catch (error) {
            console.log('\nNot a Vendor');
        }
        const userWishlist = await user
            .related('wishlistEvents')
            .query()
            .preload('location')
            .preload('media');
        const userFavourites = await user
            .related('favouritesUser')
            .query()
            .preload('favouritesVendor', (query) => {
            query.select(['id', 'companyName']);
        });
        await auth.use('web').login(user);
        return view.render('pages/dashboard/profile', {
            user: user,
            userWishlist: userWishlist,
            userFavourites: userFavourites,
        });
    }
    async edit({ auth, view }) {
        let user = await User.query()
            .where('id', auth.user?.$attributes.id)
            .preload('role')
            .firstOrFail();
        try {
            user = await User.query()
                .where('id', auth.user?.$attributes.id)
                .preload('billingAddress')
                .preload('role')
                .firstOrFail();
        }
        catch (error) {
            console.log('\nNot a Vendor');
        }
        await auth.use('web').login(user);
        return view.render('pages/auth/edit_profile', {
            user: user,
        });
    }
}
//# sourceMappingURL=register_controller.js.map