'use strict'

const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const generateKeyPairPromise = () =>  {
  return new Promise((resolve, reject) => {
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      });
      resolve({ privateKey, publicKey });
    } catch (error) {
      reject(error);
    }
  })
}

const createTokenPair = async ( payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
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

module.exports = {
  createTokenPair,
  generateKeyPairPromise
}