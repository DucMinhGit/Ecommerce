'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.get('/product/search/:keyword', asyncHandler(productController.getListSearchProduct));
router.get('/product/all', asyncHandler(productController.getAllProducts));

router.use(authenticationV2);
router.post('/product/create', asyncHandler(productController.createProduct));
router.post('/product/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/product/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

router.get('/product/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/product/published/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router