'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);
router.post('/product/create', asyncHandler(productController.createProduct));
router.get('/product/drafts/all', asyncHandler(productController.getAllDraftsShop));

module.exports = router