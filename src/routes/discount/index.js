'use strict'

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

router.use(authenticationV2);
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router