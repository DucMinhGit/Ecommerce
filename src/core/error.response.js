'use strict'

const { CODES, MESSAGES } = require('../utils/const');
const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode');

class ErrorResponse extends Error
{
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse
{
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse
{
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

class CreateFailureError extends ErrorResponse  {
  constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message)
  }
}

class ModelFailureError extends ErrorResponse  {
  constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  CreateFailureError,
  ModelFailureError
}