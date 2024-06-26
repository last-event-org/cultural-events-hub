import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import WishlistsController from '#controllers/events/wishlists_controller'

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
    router.post('/register', [RegisterController, 'store']).as('register.store')
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

router.group(() => {
  router.get('/', [EventsController, 'index']).as('index')
  router.get('/create', [EventsController, 'create']).as('create').use(middleware.auth())
  router.get('/:id', [EventsController, 'show']).as('show')
  router.post('/', [EventsController, 'store']).as('store').use(middleware.auth())
  router.get('/:id/edit', [EventsController, 'edit']).as('edit')
  router.patch('/:id', [EventsController, 'update']).as('update')
  router.delete('/:id', [EventsController, 'destroy']).as('destroy')
}).prefix('events').as('events')


// PANIER
router.post('/events/:id', [CartController, 'store']).as('cart.store').use(middleware.auth())
router.get('/cart', [CartController, 'show']).as('cart.show').use(middleware.auth())
router
  .post('/cart/:id', [CartController, 'confirmOrder'])
  .as('cart.validate')
  .use(middleware.auth())

router.post('/cart/add/:id', [CartController, 'addQuantity']).as('cart.add')
router.post('/cart/remove/:id', [CartController, 'removeQuantity']).as('cart.remove')
router.post('/cart/delete/:id', [CartController, 'deleteOrderLine']).as('cart.delete')

router.delete('/cart/:id', [CartController, 'destroy']).as('cart.destroy').use(middleware.auth())


router.group(() => {
  router.get('/', [WishlistsController, 'index']).as('index').use(middleware.auth())
  router.post('/add/:id', [WishlistsController, 'addToWishlist']).as('add').use(middleware.auth())
  router.delete('/:id', [WishlistsController, 'destroy']).as('destroy')
}).prefix('wishlist').as('wishlist')