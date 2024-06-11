import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import HomeController from '#controllers/auth/home_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'


router.group(() => {
    router.get('/', [HomeController, 'index']).as('home')

    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    
    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
}).as('auth')
