'use strict'

const { CODES, MESSAGES, STATUS } = require('../utils/const');

class SuccessResponse
{
  constructor({ 
    message,
    statusCode = CODES.SUCCESS,
    reasonStatusCode = STATUS.SUCCESS,
    metadata = {}
  }) {
    this.message = message ?? reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class Success extends SuccessResponse {
  constructor({ message, metadata}) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({ 
    message,
    statusCode = CODES.CREATED,
    reasonStatusCode = STATUS.CREATED,
    metadata,
    options = {}
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  Success,
  Created
}