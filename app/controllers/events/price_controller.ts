import Price from '#models/price'
import type { HttpContext } from '@adonisjs/core/http'

export default class PriceController {
  
  async destroy({ response, params, i18n, session }: HttpContext) {

    try {
      const price = await Price.findOrFail(params['id'])
      await price.delete()
  } catch (error) {
      console.log(error)
      const errorMsg = i18n.t('messages.errorDestroyPrice')
      session.flash('error', errorMsg)
  }
  response.redirect().back()
  }
}