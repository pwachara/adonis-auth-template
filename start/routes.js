'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('home').as('home').middleware(['auth'])

Route.get('register', 'Auth/RegisterController.showRegisterForm').middleware(['guest'])
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
Route.get('login', 'Auth/LoginController.showLoginForm').middleware(['guest'])
Route.post('login', 'Auth/LoginController.login').as('login')
//Route.get('home', 'Auth/LoginController.login').as('login')
Route.get('logout', 'Auth/AuthenticatedController.logout')
Route.get('password/send-reset-email', 'Auth/PasswordResetController.showSendLinkRequestForm').middleware(['guest'])
Route.post('password/send-reset-email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm').middleware(['guest'])
Route.post('password/reset/', 'Auth/PasswordResetController.reset')