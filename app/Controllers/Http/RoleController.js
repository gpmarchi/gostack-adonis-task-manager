'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Role = use('Role')

/**
 * Resourceful controller for interacting with roles
 */
class RoleController {
  /**
   * Show a list of all roles.
   * GET roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const roles = await Role.query().with('permissions').fetch()

    return roles
  }

  /**
   * Create/save a new role.
   * POST roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { permissions, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permissions',
    ])

    const role = await Role.create(data)

    if (permissions) {
      await role.permissions().attach(permissions)
    }

    await role.load('permissions')

    return role
  }

  /**
   * Display a single role.
   * GET roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, request, response, antl }) {
    try {
      const role = await Role.findOrFail(params.id)

      await role.load('permissions')

      return role
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.role.not.found'),
      })
    }
  }

  /**
   * Update role details.
   * PUT or PATCH roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, antl }) {
    const { permissions, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permissions',
    ])

    try {
      const role = await Role.findOrFail(params.id)

      role.merge(data)

      const trx = await Database.beginTransaction()

      await role.save(trx)

      if (permissions) {
        await role.permissions().sync(permissions, trx)
      }

      trx.commit()

      await role.load('permissions')

      return role
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.role.not.found'),
      })
    }
  }

  /**
   * Delete a role with id.
   * DELETE roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, antl }) {
    try {
      const role = await Role.findOrFail(params.id)

      await role.delete()
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.role.not.found'),
      })
    }
  }
}

module.exports = RoleController
