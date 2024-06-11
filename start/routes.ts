/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import router from '@adonisjs/core/services/router'
const RegistersController = () => import('#controllers/auth/registers_controller')
// import RegistersController from '#controllers/registers_controller'
import { middleware } from '#start/kernel'

router
  .get('/', async (ctx) => {
    await ctx.auth.check()
    return ctx.view.render('pages/home')
  })
  .as('home')

router.on('/test').render('pages/test').as('test').use(middleware.auth())

router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')

    router.post('/logout', [LogoutController, 'handle']).as('logout')
  })
  .as('auth')
  .use(middleware.auth())
router.get('/register', [RegistersController, 'index']).as('register.index')
router.post('/register', [RegistersController, 'store']).as('register.store')
// router.resource('/register', RegistersController)
