'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/users', 'UserController.store').validator('User')
Route.post('/sessions', 'SessionController.store').validator('Session')

Route.post('/forgot', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.patch('/forgot', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('/files/:id', 'FileController.show')

Route.group(() => {
  Route.get('/users', 'UserController.index')
  Route.get('/users/:id', 'UserController.show')
  Route.patch('/users/:id', 'UserController.update')

  Route.post('/files', 'FileController.store')

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map([[['projects.store'], ['Project']]]))
    .middleware('is:(administrator || manager)')
  Route.get('/projects', 'ProjectController.index').middleware(
    'can:read_projects'
  )
  Route.get('/projects/:id', 'ProjectController.show').middleware(
    'can:read_projects'
  )

  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['projects.tasks.store'], ['Task']]]))

  Route.resource('permissions', 'PermissionController').apiOnly()

  Route.resource('roles', 'RoleController').apiOnly()
}).middleware(['auth'])
