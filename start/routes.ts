/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import RegistersController from '#controllers/registers_controller'

router.on('/').render('pages/home')
router.get('/register', [RegistersController, 'index'])
// router.resource('/register', RegistersController)
