'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('../../Models/File')} */
const File = use('App/Models/File')
/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  /**
   * Show an existing file.
   * Get file
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    const file = await File.findOrFail(params.id)

    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, antl }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const filename = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), { name: filename })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: filename,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      })

      return file
    } catch (error) {
      return response.status(error.status).send({
        error: antl.formatMessage('messages.file.upload'),
      })
    }
  }
}

module.exports = FileController
