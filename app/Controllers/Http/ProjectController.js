'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('../../Models/Project')} */
const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {Request} ctx.request
   * @param {AuthSession} ctx.auth
   */
  async index({ request, auth }) {
    const { page } = request.get()

    const projects = await Project.query()
      .where('user_id', auth.user.id)
      .with('user')
      .paginate(page)

    return projects
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {AuthSession} ctx.auth
   */
  async store({ request, auth }) {
    const data = request.only(['title', 'description'])

    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   *
   */
  async show({ params, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update({ params, request, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      const data = request.only(['title', 'description'])

      project.merge(data)

      project.save()

      return project
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy({ params, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      project.delete()
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }
}

module.exports = ProjectController
