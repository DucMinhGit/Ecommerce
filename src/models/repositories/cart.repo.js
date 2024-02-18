'use strict'

const { convertToObjectIdMongodb } = require('../../utils');
const { cart } = require('../cart.model');
const findCartById = async (cardId) => {
  return await cart.findOne({_id: convertToObjectIdMongodb(cardId), card_state: 'active'}).lean();
}

module.exports = {
  findCartById
}