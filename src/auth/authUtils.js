'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { MESSAGES } = require('../utils/const');

const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
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

    //
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log(`error verify::`, error);
      } else {
        console.log(`decode verify::`, decode);
      }
    })
    return { accessToken, refreshToken };
  } catch (error) {

  }
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError(MESSAGES.INVALID_REQUEST);

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError(MESSAGES.NOT_FOUND_KEY);

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError(MESSAGES.INVALID_REQUEST);

  try {

    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if(userId !== decodeUser.userId) throw new AuthFailureError(MESSAGES.INVALID_USER);

    req.keyStore = keyStore;

    return next();

  } catch (error) {
    throw error;
  }
})

module.exports = {
  createTokenPair,
  authentication
}