import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const HomeController = () => import('#controllers/auth/home_controller')
const RegistersController = () => import('#controllers/auth/registers_controller')

router.get('/', [HomeController, 'index']).as('home')


router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.get('/register', [RegistersController, 'index']).as('register')
    router.post('/register', [RegistersController, 'store']).as('register.store')
    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .as('auth')
