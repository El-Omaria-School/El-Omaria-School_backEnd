const BaseError = require("./baseError");

class validationError extends BaseError {
  constructor(message) {
    super(422, message);
  }
}

module.exports = validationError;
