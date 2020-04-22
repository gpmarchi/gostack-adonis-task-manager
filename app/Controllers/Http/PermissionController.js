'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('../../Models/Permission')} */
const Permission = use('Permission')

/**
 * Resourceful controller for interacting with permissions
 */
class PermissionController {
  /**
   * Show a list of all permissions.
   * GET permissions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const permissions = await Permission.all()

    return permissions
  }

  /**
   * Create/save a new permission.
   * POST permissions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'slug', 'description'])

    const permission = await Permission.create(data)

    return permission
  }

  /**
   * Display a single permission.
   * GET permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, request, response, antl }) {
    try {
      const permission = await Permission.findOrFail(params.id)

      return permission
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.permission.not.found'),
      })
    }
  }

  /**
   * Update permission details.
   * PUT or PATCH permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, antl }) {
    const data = request.only(['name', 'slug', 'description'])

    try {
      const permission = await Permission.findOrFail(params.id)

      permission.merge(data)

      await permission.save()

      return permission
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.permission.not.found'),
      })
    }
  }

  /**
   * Delete a permission with id.
   * DELETE permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, antl }) {
    try {
      const permission = await Permission.findOrFail(params.id)

      permission.delete()
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.permission.not.found'),
      })
    }
  }
}

module.exports = PermissionController
