import type { HttpContext } from '@adonisjs/core/http'


export default class HomeController {

  async index({ view, auth }: HttpContext) {
    await auth.check()
    return view.render('pages/home')
  }
}