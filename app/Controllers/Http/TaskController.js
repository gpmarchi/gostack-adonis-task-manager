'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('../../Models/Task')} */
const Task = use('App/Models/Task')
/** @type {typeof import('../../Models/Project')} */
const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {AuthSession} ctx.auth
   */
  async index({ params, auth }) {
    const tasks = await Task.query()
      .where({ project_id: params.projects_id, user_id: auth.user.id })
      .with('user')
      .fetch()

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ params, request, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.projects_id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      const data = request.only([
        'user_id',
        'file_id',
        'title',
        'description',
        'due_date',
      ])

      const task = await Task.create({
        ...data,
        project_id: params.projects_id,
      })

      return task
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   */
  async show({ params, auth }) {
    const task = await Task.query()
      .where({
        id: params.id,
        project_id: params.projects_id,
        user_id: auth.user.id,
      })
      .with('project')
      .with('user')
      .with('file')
      .fetch()

    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update({ params, request, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.projects_id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      const task = await Task.findOrFail(params.id)

      const data = request.only([
        'user_id',
        'file_id',
        'title',
        'description',
        'due_date',
      ])

      task.merge(data)

      task.save()

      return task
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth, antl }) {
    try {
      const project = await Project.findOrFail(params.projects_id)

      if (project.user_id !== auth.user.id) {
        return response.status(403).send({
          error: antl.formatMessage('messages.unauthorized'),
        })
      }

      const task = await Task.findOrFail(params.id)

      task.delete()
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.project.not.found'),
      })
    }
  }
}

module.exports = TaskController
