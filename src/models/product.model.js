'use strict'

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_slug: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set:(val) => Math.round(val * 10) / 10
  },
  product_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

// Document middleware: runs before.save() and create()...
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, {lower: true});
  next();
});

const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  meterial: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: 'clothes',
  timestamps: true
});

const electronicsSchema = new Schema({
  manufactturer: { type: String, required: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: 'electronics',
  timestamps: true
});

const furnitureSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  meterial: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: 'furnitures',
  timestamps: true
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronics: model('Electronics', electronicsSchema),
  clothing: model('Clothings', clothingSchema),
  furniture: model('Furnitures', furnitureSchema)
}