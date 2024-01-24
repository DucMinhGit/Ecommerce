'use strict'

const { BadRequestError } = require('../core/error.response');
const { getInfoData } = require('../utils');
const { MESSAGES } = require('../utils/const');
const { 
  product, 
  electronics, 
  clothing, furniture 
} = require('../models/product.model');
const { 
  findAllDraftsForShop, 
  publishProductByShop,
  findAllPublishForShop
} = require('../models/repositories/product.repo');

class ProductFactory {

  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct (type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if(!productClass) throw new BadRequestError(`${MESSAGES.INVALID_PRODUCT_TYPES} ${type}`);

    return new productClass(payload).createProduct();
  }

  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop({product_shop, product_id});
  }

  static async findAllDraftsForShop({ product_shop, limit = 50 , skip = 0}) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50 , skip = 0}) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
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

  async createProduct(product_id) {
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
        ], object: await product.create({...this, _id: product_id})
      })
    }
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequestError(MESSAGES.CREATE_CLOTHING_ERROR);

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError(MESSAGES.CREATE_PRODUCT_ERROR);

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronics) throw new BadRequestError(MESSAGES.CREATE_CLOTHING_ERROR);

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError(MESSAGES.CREATE_PRODUCT_ERROR);

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequestError(MESSAGES.CREATE_CLOTHING_ERROR);

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError(MESSAGES.CREATE_PRODUCT_ERROR);

    return newProduct;
  }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;