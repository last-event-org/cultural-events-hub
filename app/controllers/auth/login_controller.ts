import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  
  async show({ view }: HttpContext) {
    return view.render('pages/connexion')
  }
  
  async store({}: HttpContext) {}
  
}