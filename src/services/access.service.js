'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { 
  ConflictRequestError,
  BadRequestError, 
  AuthFailureError, 
  CreateFailureError
} = require('../core/error.response');

const {
  SALT_OR_ROUNDS,
  ENCRYPT_ENCODING,
  ROLES,
  MESSAGES,
  CODES
} = require('../utils/const');
const { findByEmail } = require('./shop.service');

class AccessService
{
  static login = async ({ email, password, refreshToken = null }) => {

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError(MESSAGES.NOT_REGISTERED);

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError();

    // Created privateKey, publicKey
    const publicKey = crypto.randomBytes(64).toString(ENCRYPT_ENCODING);
    const privateKey = crypto.randomBytes(64).toString(ENCRYPT_ENCODING);

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    });

    return {
      shop: getInfoData({
        fields: [
          '_id',
          'name',
          'email'
        ], object: foundShop
      }), tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
  
    if (holderShop) throw new ConflictRequestError(MESSAGES.EMAIL_ALREADY_EXISTS);

    const passwordHash = await bcrypt.hash(password, SALT_OR_ROUNDS);

    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [ROLES.SHOP]
    });

    if (newShop) {
      // Created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString(ENCRYPT_ENCODING);
      const privateKey = crypto.randomBytes(64).toString(ENCRYPT_ENCODING);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      });

      if (!keyStore) throw new BadRequestError(MESSAGES.CREATE_PUBLIC_KEY_TOKEN_ERROR, CODES.ERROR);

      const tokens = await createTokenPair({
          userId: newShop._id,
          email
        }, keyStore, privateKey
      );

      return {
        code: CODES.CREATED,
        metadata: {
          shop: getInfoData({
            fields: [
              '_id',
              'name',
              'email'
            ], object: newShop
          }), 
          tokens
        }
      }
    }
    throw new CreateFailureError(MESSAGES.CREATE_SHOP_ERROR);
  }

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  }
}

module.exports = AccessService;