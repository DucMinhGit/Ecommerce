'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { MESSAGES } = require('../utils/const');
const { findByUserId } = require('../services/keyToken.service');

const { 
  AuthFailureError,
  NotFoundError,
  CreateFailureError,
  BadRequestError
} = require('../core/error.response');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'refreshtoken'
}

const createTokenPair = async ( payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new CreateFailureError(error.message);
  }
}

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError(MESSAGES.INVALID_REQUEST);

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError(MESSAGES.NOT_FOUND_KEY);

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
  
      if(userId !== decodeUser.userId) throw new AuthFailureError(MESSAGES.INVALID_USER);
  
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken
  
      return next();
  
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError(MESSAGES.INVALID_REQUEST);

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if(userId !== decodeUser.userId) throw new AuthFailureError(MESSAGES.INVALID_USER);

    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();

  } catch (error) {
    throw new BadRequestError(error.message);
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  verifyJWT,
  authenticationV2
}