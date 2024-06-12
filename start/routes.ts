import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import HomeController from '#controllers/home_controller'
import router from '@adonisjs/core/services/router'
const RegistersController = () => import('#controllers/auth/registers_controller')
// import RegistersController from '#controllers/registers_controller'
import { middleware } from '#start/kernel'

router.get('/', [HomeController, 'index']).as('home')

router.group(() => {

    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.get('/register', [RegistersController, 'index']).as('register')
    router.post('/register', [RegistersController, 'store']).as('register.store')
    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
}).as('auth')



