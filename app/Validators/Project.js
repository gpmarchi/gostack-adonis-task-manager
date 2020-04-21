'use strict'

class Project {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      title: 'required',
      description: 'required',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = Project
