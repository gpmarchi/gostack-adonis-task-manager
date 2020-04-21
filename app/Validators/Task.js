'use strict'

class Task {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      title: 'required',
      due_date: 'date',
    }
  }

  get messages() {
    return this.ctx.antl.list('validation')
  }
}

module.exports = Task
