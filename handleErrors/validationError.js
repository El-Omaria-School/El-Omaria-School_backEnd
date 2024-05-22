const BaseError = require("./baseError");

class ValidationError extends BaseError {
  constructor(message) {
    super(422, message);
  }
}

module.exports = { ValidationError };
