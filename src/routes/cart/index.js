'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

// router.use(authenticationV2);
router.get('', asyncHandler(cartController.listToCart));
router.post('', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.update));
router.delete('', asyncHandler(cartController.delete));

module.exports = router