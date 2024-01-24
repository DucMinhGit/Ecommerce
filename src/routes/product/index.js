'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);
router.post('/product/create', asyncHandler(productController.createProduct));
router.post('/product/publish/:id', asyncHandler(productController.publishProductByShop));

router.get('/product/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/product/published/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router