'use strict'

const CheckoutService = require('../services/checkout.service');
const { SuccessResponse } = require('../core/success.response');

class CheckoutController
{
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Checkout review ok',
      metadata: await CheckoutService.checkoutReview(req.body)
    });
  }
}

module.exports = new CheckoutController()
