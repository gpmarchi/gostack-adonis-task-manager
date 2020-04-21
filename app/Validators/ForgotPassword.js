'use strict'

class ForgotPassword {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|email',
      redirect_url: 'required|url',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = ForgotPassword
