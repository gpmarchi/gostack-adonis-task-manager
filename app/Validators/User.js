'use strict'

class User {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = User
