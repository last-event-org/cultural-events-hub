import { createRegisterValidator } from '#validators/register'
import { createVendorDataValidator } from '#validators/vendor_data'
import { Route, type HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { createAddressValidator } from '#validators/address'
import Address from '#models/address'

export default class RegistersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ session, request, response, auth, view }: HttpContext) {
    const payload = await request.validateUsing(createRegisterValidator)
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

  async updateProfileType({ request, response, auth }: HttpContext) {
    /*
    When registering on the website we are directed to a second page
    in which we are asked whether we would like to buy or sell event tickets:
    in the case we would like to sell we will have to fill some more data (billing related) 
    */
    const user = await User.findOrFail(auth.user?.$attributes.id)

    try {
      const vendorDataPayload = await request.validateUsing(createVendorDataValidator)

      user.companyName = vendorDataPayload.company_name
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

      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('Validation Error:', error)
    }
  }

  /**
   * Show individual record
   */
  async show({ params, auth, view }: HttpContext) {
    let user = await User.query()
      .where('id', '=', auth.user?.$attributes.id)
      .preload('billingAddress')
      .preload('shippingAddress')
      .preload('role')
      .firstOrFail()

    await auth.use('web').login(user)
    return view.render('pages/dashboard/profile', {
      user: user,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params, auth, view }: HttpContext) {
    let user = await User.query()
      .where('id', '=', auth.user?.$attributes.id)
      .preload('billingAddress')
      .preload('shippingAddress')
      .preload('role')
      .firstOrFail()

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
