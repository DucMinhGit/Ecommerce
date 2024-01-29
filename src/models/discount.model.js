'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: 'fixed_amount' },
  discount_value: { type: Number, required: true },
  discount_code: { type: String, required: true },
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: Date, required: true }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);