'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ConflictRequestError, BadRequestError } = require('../core/error.response');
const {
  SALT_OR_ROUNDS,
  ENCRYPT_ENCODING,
  ROLES,
  MESSAGES,
  CODES
} = require('../utils/const');

class AccessService
{
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
  
    if (holderShop) {
      throw new ConflictRequestError(MESSAGES.EMAIL_ALREADY_EXISTS);
    }

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

      if (!keyStore) {
        throw new BadRequestError(MESSAGES.CREATE_PUBLIC_KEY_TOKEN_ERROR, CODES.ERROR);
      }

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
          }), tokens
        }
      }
    }
    return {
      code: CODES.SUCCESS,
      metadata: null
    }
  }
}

module.exports = AccessService;