const BaseError = require('./baseError')

class NotFoundError extends BaseError {
  constructor(message) {
    super(404, message)
  }
}

module.exports = NotFoundError
