'use strict'

const discount = require('../models/discount.model');
const convertToObjectIdMongodb = require('../utils');
const { MESSAGES } = require('../utils/const');
const {
  BadRequestError, NotFoundError
} = require('../core/error.response');

class DiscountService 
{
  static async createDiscountCode(payload) {
    const { 
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(MESSAGES.DISCOUNT_EXPIRED);
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError(MESSAGES.DISCOUNT_ERROR_SET_DATE);
    }

    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError(MESSAGES.DISCOUNT_EXISTS);
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_count_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean();

    if(!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: {$in: discount_product_ids},
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products;
  }
}