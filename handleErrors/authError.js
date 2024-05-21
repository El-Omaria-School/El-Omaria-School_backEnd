const BaseError = require('./baseError')

class AuthError extends BaseError {
  constructor(message) {
    super(401, message)
  }
}

module.exports = AuthError
