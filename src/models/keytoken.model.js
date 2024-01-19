'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
var KeyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    require: true
  },
  privateKey: {
    type: String,
    require: true
  },
  refreshTokensUsed: {
    type: Array, 
    default: []
  },
  refreshToken: {
    type: String,
    require: true
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

// Export the model
module.exports = model(DOCUMENT_NAME, KeyTokenSchema)