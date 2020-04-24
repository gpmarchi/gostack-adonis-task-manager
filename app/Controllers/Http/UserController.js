'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
const Database = use('Database')

class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const users = await User.query().with('permissions').with('roles').fetch()

    return users
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles',
    ])

    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data, trx)

    await user.addresses().createMany(addresses, trx)

    trx.commit()

    if (roles) {
      await user.roles().attach(roles)
    }

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await user.loadMany(['roles', 'permissions', 'addresses'])

    return user
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, request, response, antl }) {
    try {
      const user = await User.findOrFail(params.id)

      await user.loadMany(['roles', 'permissions'])

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.user.not.found'),
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, antl }) {
    const { addresses, permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'addresses',
      'permissions',
      'roles',
    ])

    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).send({
        error: antl.formatMessage('messages.user.not.found'),
      })
    }

    user.merge(data)

    const trx = await Database.beginTransaction()

    await user.save(trx)

    if (addresses) {
      await user.addresses().delete()
      await user.addresses().createMany(addresses, trx)
    }

    if (roles) {
      await user.roles().sync(roles, trx)
    }

    if (permissions) {
      await user.permissions().sync(permissions, trx)
    }

    trx.commit()

    await user.loadMany(['roles', 'permissions', 'addresses'])

    return user
  }
}

module.exports = UserController
