import type { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class CartMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */

  async handle({ auth, view }: HttpContext, next: NextFn) {
    if (await auth.check()) {
      const user = await auth.user
      if (user) {
        const hasOrder = await user.related('order').query().where('is_paid', 'false')
        view.share({ userHasOrder: hasOrder.length > 0 ? true : false })
      } else {
        view.share({ userHasOrder: false })
      }
    }

    await next()
  }
}
