'use strict'

const ProductService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res);
  }

  /**
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON} 
   */
  getAllDraftsShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft success!',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      })
    }).send(res)
  }
}

module.exports = new ProductController()