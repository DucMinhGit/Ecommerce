'use strict'

const { CODES, MESSAGES } = require('../utils/const');

class ErrorResponse extends Error
{
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse
{
  constructor(message = MESSAGES.CONFLICT, statusCode = CODES.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse
{
  constructor(message = MESSAGES.FORBIDDEN, statusCode = CODES.FORBIDDEN) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError
}