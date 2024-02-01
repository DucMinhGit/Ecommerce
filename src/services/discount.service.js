'use strict'

const discount = require('../models/discount.model');
const convertToObjectIdMongodb = require('../utils');
const { MESSAGES } = require('../utils/const');
const {
  BadRequestError, NotFoundError
} = require('../core/error.response');
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require('../models/repositories/discount.repo');

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
      discount_min_order_value: min_order_value || 0,
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

  static async getAllDiscountCodesByShop({
    limit,
      page,
      shopId
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter:  {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    });

    if(!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`);

    const { 
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError(`Discount expired!`);
    if (!discount_max_uses) throw new NotFoundError(`Discount are out!`);

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError(MESSAGES.DISCOUNT_EXPIRED);
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}!`);
      }
    }

    if(discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(user => user.userId === userId);
      if (userUsedDiscount) {

      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : total * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    });

    if(!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`);

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    });

    return result;
  }
}

module.exports = DiscountService;