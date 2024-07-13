import { createRegisterValidator } from '#validators/register'
import { createVendorDataValidator } from '#validators/vendor_data'
import { updateUserProfileMandatoryValidator } from '#validators/user_profile'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import Event from '#models/event'
import { createAddressValidator } from '#validators/address'
import Address from '#models/address'
import { errors } from '@vinejs/vine'
import {
  randomTokenString,
  sendAccountVerified,
  sendVerificationEmail,
} from '#services/account_service'
import { DateTime } from 'luxon'
import { tokenValidator } from '#validators/token'

export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async dashboard({ view, auth }: HttpContext) {
    const user = await User.query()
      .where('id', auth.user?.$attributes.id)
      .preload('role')
      .firstOrFail()

    const userWishlist = await user
      .related('wishlistEvents')
      .query()
      .preload('location')
      .preload('media')

    const userFavourites = await user
      .related('favouritesUser')
      .query()
      .preload('favouritesVendor', (query) => {
        query.select(['id', 'companyName'])
      })

    let vendorIds = userFavourites.map((e) => e.id)

    let date = DateTime.now()
    let dayBegin: string = date.set({ hour: 0, minute: 0, second: 0 }).toSQLDate() ?? ''
    let dayEnd: string = date.plus({ days: 7 }).toSQLDate() ?? ''

    const nextEventsVendors = await Event.query()
      .select('users.id as user_id')
      .join('users', 'events.vendor_id', 'users.id')
      .count('events.id as count_events')
      .whereBetween('events.event_start', [dayBegin, dayEnd])
      .whereIn('users.id', vendorIds)
      .groupBy('user_id')

    const allEventsVendors = await Event.query()
      .select('users.id as user_id')
      .join('users', 'events.vendor_id', 'users.id')
      .count('events.id as count_events')
      .whereIn('users.id', vendorIds)
      .groupBy('user_id')

    let vendorEvents = {}
    vendorIds.forEach((vendor) => {
      if (!vendorEvents[vendor]) {
        vendorEvents[vendor] = { nextEvents: 0, allEvents: 0 }
      }
    })

    nextEventsVendors.forEach((vendor) => {
      vendorEvents[vendor.$extras.user_id].nextEvents = vendor.$extras.count_events
    })

    allEventsVendors.forEach((vendor) => {
      vendorEvents[vendor.$extras.user_id].allEvents = vendor.$extras.count_events
    })

    return view.render('pages/dashboard/dashboard', {
      user: user,
      userWishlist: userWishlist,
      userFavourites: userFavourites,
      vendorEvents: vendorEvents,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ i18n, session, request, response, auth, view }: HttpContext) {
    const payload = await request.validateUsing(createRegisterValidator)
    const lang = i18n.locale
    const parsedUrl = new URL(request.completeUrl())
    const origin = `${parsedUrl.protocol}//${parsedUrl.host}`
    // check if user email is already in the db
    const userEmail = await User.findBy('email', payload.email)
    if (userEmail) {
      const errorMsg = i18n.t('messages.register_duplicateEmail')
      session.flash('error', errorMsg)
      return response.redirect().back()
    }
    const token = await randomTokenString()
    console.log(token)
    const user = new User()

    user.firstname = payload.first_name
    user.lastname = payload.last_name
    user.email = payload.email
    user.password = payload.password
    user.verificationToken = token

    const role = await Role.findBy('role_name', 'USER')
    if (role) {
      user.roleId = role.id
    }

    await user.save()
    const subject = i18n.t('messages.mail_verify_subject')
    await sendVerificationEmail(user, token, origin, lang, subject)

    if (user.$isPersisted) {
      // await auth.use('web').login(user)
      return view.render('pages/auth/profile-type', {
        user: user,
      })
    } else {
      return response.redirect().back()
    }
  }

  async verificationEmailSent({ view }: HttpContext) {
    return view.render('pages/auth/verify_email')
  }

  async verifyUser({ response, request, session, i18n }: HttpContext) {
    console.log('EMAIL VERIFICATION')
    console.log()
    const lang = i18n.locale
    const parsedUrl = new URL(request.completeUrl())
    const origin = `${parsedUrl.protocol}//${parsedUrl.host}`

    const data = {
      token: request.qs().token,
    }
    try {
      const { token } = await tokenValidator.validate(data)
      const user = await User.findByOrFail('verificationToken', token)
      user.isVerified = true
      user.verificationToken = null
      user.verifiedAt = DateTime.now()
      await user.save()
      const subject = i18n.t('messages.mail_account_activated_subject')
      await sendAccountVerified(user, origin, lang, subject)
      const successMsg = i18n.t('messages.login_verified_success')
      session.flash('success', successMsg)
      return response.redirect().toRoute('auth.login.show')
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      const errorMsg = i18n.t('messages.login_verified_error')
      session.flash('error', errorMsg)
      return response.redirect().toRoute('auth.login.show')
    }
  }

  async switchToVendor({ view }: HttpContext) {
    return view.render('pages/auth/switch-to-vendor')
  }

  async getUserBillingAddress(user: User) {
    const userBillingAddressId = user.$attributes.billingAddressId
    if (user && userBillingAddressId) {
      const vendorAddress = await Address.query().where('id', '=', userBillingAddressId).first()
      return vendorAddress
    }
    return false
  }

  async updateUserRole(user: User) {
    const vendorRole = await Role.findBy('role_name', 'VENDOR')
    const userRole = await Role.findBy('role_name', 'USER')
    const userBillingAddress = await this.getUserBillingAddress(user)

    if (vendorRole && userRole) {
      if (
        userBillingAddress &&
        userBillingAddress.street &&
        userBillingAddress.number &&
        userBillingAddress.city &&
        userBillingAddress.zipCode &&
        userBillingAddress.country
      ) {
        user.roleId = vendorRole.id
      } else {
        user.roleId = userRole.id
      }
    }
    await user.save()
  }

  async updateMandatoryProfileData(
    request: HttpContext['request'],
    session: HttpContext['session'],
    user: User
  ) {
    let userProfilePayload = null

    try {
      userProfilePayload = await request.validateUsing(updateUserProfileMandatoryValidator)
      user.firstname = userProfilePayload.first_name
      user.lastname = userProfilePayload.last_name
      user.email = userProfilePayload.email
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      const errorMsg = 'Les champs Prénom, Nom et Email sont requis'
      session.flash('mandatoryProfileData', errorMsg)
      return false
    }
    return true
  }

  async updateUserBillingAddress(
    request: HttpContext['request'],
    session: HttpContext['session'],
    user: User
  ) {
    let userBillingAddressPayload = null

    // In the case where the user has a VENDOR role we fetch its billing address
    let vendorAddress = await this.getUserBillingAddress(user)

    try {
      // userBillingAddressPayload = await request.validateUsing(createAddressValidator)
      userBillingAddressPayload = await request.validateUsing(createVendorDataValidator)
      // When the user has a USER role (vendorAddress == null) we must create a new Address object
      if (!vendorAddress) {
        vendorAddress = new Address()
      }
      vendorAddress.street = userBillingAddressPayload.street
      vendorAddress.number = userBillingAddressPayload.number
      vendorAddress.zipCode = userBillingAddressPayload.zip_code
      vendorAddress.city = userBillingAddressPayload.city
      vendorAddress.country = userBillingAddressPayload.country

      await vendorAddress.save()

      // if user has USER role it means there is no billing address
      // associated with it so we must link the new billing address
      // created previously to the current user
      if (user.role.roleName === 'USER') {
        user.billingAddressId = vendorAddress.id
        vendorAddress.userId = user.id
        await user.related('billingAddress').save(vendorAddress)
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages)
      }
      const errorMsg = "Tous les champs de l'adresse de facturation doivent être complétés"
      session.flash('billingAddressError', errorMsg)
      return false
    }
    return true
  }

  async updateVendorData(
    request: HttpContext['request'],
    session: HttpContext['session'],
    response: HttpContext['response'],
    user: User
  ) {
    let userVendorDataPayload = null

    const isVatEntered = request.input('vat_number')
    const isCompanyNameEntered = request.input('company_name')
    const isStreetEntered = request.input('street')
    const isNumberEntered = request.input('number')
    const isZipEntered = request.input('zip_code')
    const isCityEntered = request.input('city')
    const isCountryEntered = request.input('country')
    const billingAddressFields = [
      isStreetEntered,
      isNumberEntered,
      isZipEntered,
      isCityEntered,
      isCountryEntered,
    ]

    if (isVatEntered || isCompanyNameEntered || billingAddressFields.some((field) => field)) {
      // if billing address validation doesn't pass we stop the process
      if (!(await this.updateUserBillingAddress(request, session, user)))
        return response.redirect().back()

      try {
        userVendorDataPayload = await request.validateUsing(createVendorDataValidator)
        if (userVendorDataPayload.company_name && userVendorDataPayload.company_name.trim() != '') {
          user.companyName = userVendorDataPayload.company_name
        } else {
          user.companyName = user.firstname + ' ' + user.lastname
        }
        user.vatNumber = userVendorDataPayload.vat_number

        await user.save()
      } catch (error) {
        const errorMsg =
          "Pour devenir Organisateur toutes les données commerciales doivent être complétées (Nom de société, numéro de TVA et l'adresse complète de facturation)"
        session.flash('userVendorData', errorMsg)
        return false
      }
    }
    return true
  }

  async update({ request, response, session, auth }: HttpContext) {
    const user = await User.query()
      .where('id', auth.user?.$attributes.id)
      .preload('role')
      .firstOrFail()

    if (user) {
      if (!(await this.updateMandatoryProfileData(request, session, user)))
        return response.redirect().back()
      const hasVendorData = await this.updateVendorData(request, session, response, user)
      if (!hasVendorData) return response.redirect().back()

      if (hasVendorData) {
        await this.updateUserRole(user)
      }

      await user.save()
      return response.redirect().toRoute('auth.profile.show')
    }
  }

  async updateProfileType({ request, response, auth }: HttpContext) {
    /*
    When registering on the website we are directed to a second page
    in which we are asked whether we would like to buy or sell event tickets:
    in the case we would like to sell we will have to fill some more data (billing related) 
    */
    const user = await User.findOrFail(auth.user?.$attributes.id)

    try {
      const vendorDataPayload = await request.validateUsing(createVendorDataValidator)

      if (vendorDataPayload.company_name && vendorDataPayload.company_name.trim() !== '') {
        user.companyName = vendorDataPayload.company_name
      } else {
        user.companyName = user.firstname + ' ' + user.lastname
      }
      user.vatNumber = vendorDataPayload.vat_number

      await user.save()
    } catch (error) {
      console.error('Vendor Validation Error:', error)
    }

    try {
      const addressPayload = await request.validateUsing(createAddressValidator)
      const address = new Address()

      address.street = addressPayload.street
      address.number = addressPayload.number
      address.zipCode = addressPayload.zip_code
      address.city = addressPayload.city
      address.country = addressPayload.country
      address.name = user.companyName ?? ''

      await address.save()
      user.billingAddressId = address.id

      await user.related('billingAddress').save(address)

      const role = await Role.findBy('role_name', 'VENDOR')
      if (role) {
        user.roleId = role.id
      }
      await user.save()

      return response.redirect().toRoute('auth.register.verify.show')
    } catch (error) {
      console.error('Validation Error:', error)
    }
  }

  /**
   * Show individual record
   */
  async show({ auth, view }: HttpContext) {
    let user = await User.query()
      .where('id', auth.user?.$attributes.id)
      .preload('role')
      .firstOrFail()

    try {
      user = await User.query()
        .where('id', auth.user?.$attributes.id)
        .preload('billingAddress')
        .firstOrFail()
    } catch (error) {
      console.log('\nNot a Vendor')
    }

    const userWishlist = await user
      .related('wishlistEvents')
      .query()
      .preload('location')
      .preload('media')

    const userFavourites = await user
      .related('favouritesUser')
      .query()
      .preload('favouritesVendor', (query) => {
        query.select(['id', 'companyName'])
      })

    await auth.use('web').login(user)
    return view.render('pages/dashboard/profile', {
      user: user,
      userWishlist: userWishlist,
      userFavourites: userFavourites,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ auth, view }: HttpContext) {
    let user = await User.query()
      .where('id', auth.user?.$attributes.id)
      .preload('role')
      .firstOrFail()

    try {
      user = await User.query()
        .where('id', auth.user?.$attributes.id)
        .preload('billingAddress')
        .preload('role')
        .firstOrFail()
    } catch (error) {
      console.log('\nNot a Vendor')
    }

    await auth.use('web').login(user)
    return view.render('pages/auth/edit_profile', {
      user: user,
    })
  }

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
