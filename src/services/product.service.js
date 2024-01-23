'use strict'

const { BadRequestError } = require('../core/error.response');
const { product, electronics, clothing } = require('../models/product.model');
const { getInfoData } = require('../utils');
const { MESSAGES } = require('../utils/const');

class ProductFactory {
  static async createProduct (type, payload) {
    switch (type) {
      case 'Electronics':
        return new Electronics(payload).createProduct();
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default: 
        throw new BadRequestError(MESSAGES.INVALID_PRODUCT_TYPES + type)
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct() {
    return {
      product: getInfoData({
        fields: [
          "product_name",
          "product_description",
          "product_price",
          "product_shop",
          "product_type",
          "product_thumb",
          "product_quantity",
          "product_attributes"
        ], object: await product.create(this)
      })
    }
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError(MESSAGES.CREATE_CLOTHING_ERROR);

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError(MESSAGES.CREATE_PRODUCT_ERROR);

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create(this.product_attributes);
    if (!newElectronics) throw new BadRequestError(MESSAGES.CREATE_CLOTHING_ERROR);

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError(MESSAGES.CREATE_PRODUCT_ERROR);

    return newProduct;
  }
}

module.exports = ProductFactory;