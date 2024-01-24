'use strict'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const { findById } = require('../services/apikey.service');
const { CODES, MESSAGES } = require('../utils/const');

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(CODES.FORBIDDEN).json({
        message: MESSAGES.FORBIDDEN + '1'
      })
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(CODES.FORBIDDEN).json({
        message: MESSAGES.FORBIDDEN + '2'
      })
    }
    req.objKey = objKey;
    return next();
  } catch (error) {

  }
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(CODES.FORBIDDEN).json({
        message: MESSAGES.FORBIDDEN + '3'
      })
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(CODES.FORBIDDEN).json({
        message: MESSAGES.FORBIDDEN + '4'
      })
    }
    return next();
  }
}

module.exports = {
  apiKey,
  permission
}