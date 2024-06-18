import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view, auth }: HttpContext) {
    await auth.check()
    const categories = await Category.query()
    return view.render('pages/home', { categories: categories })
  }
}
