import { createRegisterValidator } from '#validators/register'
import { createVendorDataValidator } from '#validators/vendor_data'
import { updateUserProfileMandatoryValidator } from '#validators/user_profile'
import { HttpContext, Route } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { createAddressValidator } from '#validators/address'
import Address from '#models/address'
import { updateUserPasswordValidator } from '#validators/password_change'

export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async dashboard({ view }: HttpContext) {
    return view.render('pages/dashboard/dashboard')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ session, request, response, auth, view }: HttpContext) {
    const payload = await request.validateUsing(createRegisterValidator)

    // check if user email is already in the db
    const userEmail = await User.findBy('email', payload.email)
    if (userEmail) {
      session.flash('duplicateEmail', 'Cet email a déjà été utilisé')
      return response.redirect().back()
    }

    if (request.input('password') !== request.input('password_confirmation')) {
      session.flash('password', 'Password do not match')
      response.redirect().back()
    }

    const user = new User()

    user.firstname = payload.first_name
    user.lastname = payload.last_name
    user.email = payload.email
    user.password = payload.password

    const role = await Role.findBy('role_name', 'USER')
    if (role) {
      user.roleId = role.id
    }
    // await user.related('role').associate(role)

    await user.save()
    if (user.$isPersisted) {
      await auth.use('web').login(user)
      return view.render('pages/auth/profile-type', {
        user: user,
      })
    } else {
      return response.redirect().back()
    }
  }

  async switchToVendor({ view }: HttpContext) {
    return view.render('pages/auth/switch-to-vendor')
  }

  async getUserBillingAddress(user: User) {
    const userBillingAddressId = user.$attributes.billingAddressId
    if (user && userBillingAddressId) {
      const vendorAddress = await Address.query()
        .where('id', '=', userBillingAddressId)
        .first()
      return vendorAddress
    }
    return false
  }

  async updateUserRole(user: User) {
    const vendorRole = await Role.findBy('role_name', 'VENDOR')
    const userRole = await Role.findBy('role_name', 'USER')
    const userBillingAddress = await this.getUserBillingAddress(user)

    if (vendorRole && userRole) {
      if (userBillingAddress && (
        userBillingAddress.street &&
        userBillingAddress.number &&
        userBillingAddress.city &&
        userBillingAddress.zipCode &&
        userBillingAddress.country
      )) {
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
    user: User) {

    let userProfilePayload = null

    try {
      userProfilePayload = await request.validateUsing(updateUserProfileMandatoryValidator)
      user.firstname = userProfilePayload.first_name
      user.lastname = userProfilePayload.last_name
      user.email = userProfilePayload.email
    } catch (error) {
      console.log('\n\n\n\n\n\n TEST3');
      const errorMsg = 'Les champs Prénom, Nom et Email sont requis'
      session.flash('mandatoryProfileData', errorMsg)
      return false
    }
    return true
  }

  async updateUserPasswordData(
    request: HttpContext['request'],
    session: HttpContext['session'],
    user: User) {

    let userPasswordPayload = null
    const isPasswordEntered = request.input('password');
    if (isPasswordEntered) {
      try {
        userPasswordPayload = await request.validateUsing(updateUserPasswordValidator)
        user.password = userPasswordPayload.password
      } catch (error) {
        const errorMsg = 'Le mot de passe doit contenir au moins une lettre majuscule, un chiffre, un symbole (@$!%*?&) et au moins 8 caractères au total.'
        session.flash('userPassword', errorMsg)
        return false
      }
    }
    return true
  }

  async updateUserBillingAddress(
    request: HttpContext['request'],
    session: HttpContext['session'],
    user: User) {

    let userBillingAddressPayload = null

    // In the case where the user has a VENDOR role we fetch its billing address
    let vendorAddress = await this.getUserBillingAddress(user)

    try {
      userBillingAddressPayload = await request.validateUsing(createAddressValidator)
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
    user: User) {

    let userVendorDataPayload = null

    const isVatEntered = request.input('vat_number');
    const isCompanyNameEntered = request.input('company_name');
    const isStreetEntered = request.input('street');
    const isNumberEntered = request.input('number');
    const isZipEntered = request.input('zip_code');
    const isCityEntered = request.input('city');
    const isCountryEntered = request.input('country');
    const billingAddressFields = [isStreetEntered, isNumberEntered, isZipEntered, isCityEntered, isCountryEntered]

    if (isVatEntered || isCompanyNameEntered || billingAddressFields.some((field) => field)) {

      // if billing address validation doesn't pass we stop the process
      if (!await this.updateUserBillingAddress(request, session, user)) return response.redirect().back()

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
        const errorMsg = "Pour devenir Organisateur toutes les données commerciales doivent être complétées (Nom de société, numéro de TVA et l'adresse complète de facturation)"
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
      if (!await this.updateMandatoryProfileData(request, session, user)) return response.redirect().back()
      if (!await this.updateUserPasswordData(request, session, user)) return response.redirect().back()
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

      if (vendorDataPayload.company_name && vendorDataPayload.company_name.trim() != '') {
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

      return response.redirect().toRoute('home')
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
      console.log('\nNot a Vendor');
    }

    await auth.use('web').login(user)
    return view.render('pages/dashboard/profile', {
      user: user,
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
      console.log('\nNot a Vendor');
    }

    await auth.use('web').login(user)
    return view.render('pages/dashboard/edit_profile', {
      user: user,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
