'use strict'

class Session {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|email',
      password: 'required',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = Session
