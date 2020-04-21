'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
/** @typedef {import('@adonisjs/mail/src/Mail')} Mail */
const Mail = use('Mail')
const crypto = use('crypto')
const dateFns = use('date-fns')

class ForgotPasswordController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, antl }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`,
        },
        (message) => {
          message
            .to(user.email)
            .from('gustavomarchi@gmail.com', 'Gustavo | Trello')
            .subject('Recuperação de senha')
        }
      )
    } catch (error) {
      response.status(error.status).send({
        error: antl.formatMessage('messages.email.not.found'),
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, antl }) {
    try {
      const { password, token } = request.all()

      const user = await User.findByOrFail('token', token)

      console.log(new Date())
      console.log(user.token_created_at)
      const tokenExpired =
        dateFns.differenceInDays(new Date(), user.token_created_at) > 2

      if (tokenExpired) {
        response.status(401).send({
          error: antl.formatMessage('messages.expired.token'),
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      response.status(error.status).send({
        error: antl.formatMessage('messages.bad.data'),
      })
    }
  }
}

module.exports = ForgotPasswordController
