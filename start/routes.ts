import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CartController = () => import('#controllers/events/cart_controller')
const VendorController = () => import('#controllers/vendors/vendor_controller')
const ListEvents = () => import('#controllers/api_listevents')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const EventsController = () => import('#controllers/events/events_controller')
const WishlistsController = () => import('#controllers/events/wishlists_controller')
const FavouritesController = () => import('#controllers/vendors/favourites_controller')
const MediaController = () => import('#controllers/events/media_controller')
const PriceController = () => import('#controllers/events/price_controller')

router.get('/', [EventsController, 'home']).as('home')

router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.get('/forgot-password', [LoginController, 'forgotPassword']).as('login.forgot-password')
    router
      .post('/forgot-password', [LoginController, 'requestNewPassword'])
      .as('login.request-new-password')
    router
      .get('/reset-password', [LoginController, 'resetPasswordShow'])
      .as('login.reset-password.show')
    router
      .post('/reset-password', [LoginController, 'resetPasswordStore'])
      .as('login.reset-password.store')

    router.get('/register', [RegisterController, 'index']).as('register')
    router.post('/register', [RegisterController, 'store']).as('register.store')
    router
      .get('/register/verify-email-sent', [RegisterController, 'verificationEmailSent'])
      .as('register.verify.show')
    router
      .get('/register/verify-email', [RegisterController, 'verifyUser'])
      .as('register.verify.store')
    router
      .get('/dashboard', [RegisterController, 'dashboard'])
      .as('dashboard')
      .use(middleware.auth())
    router
      .post('/update', [RegisterController, 'update'])
      .as('register.update')
      .use(middleware.auth())
    router
      .post('/profile-type', [RegisterController, 'updateProfileType'])
      .as('register.update-profile-type')
    // .use(middleware.auth())
    router
      .get('/dashboard/profile', [RegisterController, 'show'])
      .as('profile.show')
      .use(middleware.auth())
    router
      .get('/dashboard/switch-to-vendor', [RegisterController, 'switchToVendor'])
      .as('profile.switch-to-vendor')
      .use(middleware.auth())
    router
      .get('/dashboard/orders', [CartController, 'index'])
      .as('profile.orders')
      .use(middleware.auth())
    router
      .get('/dashboard/vendor/orders', [VendorController, 'orders'])
      .as('vendor.orders')
      .use(middleware.auth())
    router
      .get('/dashboard/vendor/events', [VendorController, 'events'])
      .as('vendor.events')
      .use(middleware.auth())
    router
      .get('/dashboard/profile/edit', [RegisterController, 'edit'])
      .as('profile.edit')
      .use(middleware.auth())
    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .as('auth')

router
  .group(() => {
    router.get('/', [EventsController, 'index']).as('index')
    router.get('/tickets', [EventsController, 'tickets']).as('tickets')
    router.get('/search', [EventsController, 'search']).as('search')
    router.get('/search-word', [EventsController, 'getEventsByWord']).as('search-word')
    router.get('/create', [EventsController, 'create']).as('create').use(middleware.auth())
    router.get('/:id', [EventsController, 'show']).as('show')
    router.post('/', [EventsController, 'store']).as('store').use(middleware.auth())
    router.get('/:id/edit', [EventsController, 'edit']).as('edit').use(middleware.auth())
    router.patch('/:id', [EventsController, 'update']).as('update').use(middleware.auth())
    router.delete('/:id', [EventsController, 'destroy']).as('destroy').use(middleware.auth())
  })
  .prefix('events')
  .as('events')

router
  .group(() => {
    router.get('/:id/delete', [MediaController, 'destroy']).as('destroy')
  })
  .prefix('media')
  .as('media')

router
  .group(() => {
    router.get('/:id/delete', [PriceController, 'destroy']).as('destroy')
  })
  .prefix('price')
  .as('price')

// PANIER
router
  .group(() => {
    router.get('/', [CartController, 'show']).as('show')

    router.post('/:id', [CartController, 'confirmOrder']).as('validate')
    router.post('/add/:id', [CartController, 'addQuantity']).as('add')
    router.post('/remove/:id', [CartController, 'removeQuantity']).as('remove')
    router.delete('/delete/:id', [CartController, 'deleteOrderLine']).as('delete')
    router.delete('/:id', [CartController, 'destroy']).as('destroy')
  })
  .use(middleware.auth())
  .prefix('cart')
  .as('cart')

router
  .group(() => {
    router.get('/', [WishlistsController, 'index']).as('index')
    router.post('/add/:id', [WishlistsController, 'addToWishlist']).as('add')
    router.post('/:id', [WishlistsController, 'destroy']).as('destroy')
  })
  .prefix('user/wishlist')
  .as('wishlist')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [FavouritesController, 'index']).as('index')
    router.post('/add/:id', [FavouritesController, 'addToFavourites']).as('add')
    router.post('/:id', [FavouritesController, 'destroy']).as('destroy')
  })
  .prefix('favourite')
  .as('favourite')
  .use(middleware.auth())

// TODO change this route to add it to the group
router.post('/events/:id', [CartController, 'store']).as('store').use(middleware.auth())

// API CALLS
router.get('/api/getEvents', [ListEvents, 'getEvents'])
// router.get('/api/getAllEvents', [ListEvents, 'getAllEvents'])
router.get('/api/getEventsByDate', [ListEvents, 'getEventsByDate'])
router.get('/api/search', [ListEvents, 'getEventsSearch'])
