const BaseError = require('./baseError')

class BadRequestError extends BaseError {
  constructor(message) {
    super(400, message)
  }
}

module.exports = BadRequestError
