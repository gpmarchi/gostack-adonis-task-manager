'use strict'

class ResetPassword {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      token: 'required',
      password: 'required|confirmed',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = ResetPassword
