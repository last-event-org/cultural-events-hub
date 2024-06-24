import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CartController = () => import('#controllers/events/cart_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const HomeController = () => import('#controllers/home_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const EventsController = () => import('#controllers/events/events_controller')

router.get('/', [HomeController, 'index']).as('home')

router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.get('/register', [RegisterController, 'index']).as('register')
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.auth())
    router
      .post('/profile-type', [RegisterController, 'updateProfileType'])
      .as('register.update-profile-type')
      .use(middleware.auth())
    router
      .get('/dashboard/profile', [RegisterController, 'show'])
      .as('profile.show')
      .use(middleware.auth())
    router
      .get('/dashboard/profile/edit', [RegisterController, 'edit'])
      .as('profile.edit')
      .use(middleware.auth())
    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .as('auth')

router.resource('events', EventsController)
router.post('/events/:id', [CartController, 'store']).as('add-to-cart').use(middleware.auth())
