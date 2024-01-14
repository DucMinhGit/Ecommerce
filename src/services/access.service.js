'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, generateKeyPairPromise } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleShop =  {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Email already!'
        }
      }

      const passwordHash = await bcrypt.hash(password, 2);

      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      });

      if (newShop) {
        // Created privateKey, publicKey
        const { privateKey, publicKey } = await generateKeyPairPromise();

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        });

        if(!publicKeyString) {
          return {
            code: 'xxx',
            message: 'publicKeyString error'
          }
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      }
      return {
        code: 200,
        metadata: null
      }
    } catch(error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService;