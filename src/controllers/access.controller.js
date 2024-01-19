'use strict'

const AccessService = require("../services/access.service");
const { MESSAGES } = require('../utils/const');
const { Created, SuccessResponse } = require('../core/success.response');

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }

  signUp = async (req, res, next) => {
    new Created({
      message: MESSAGES.REGISTER_SUCCESS,
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: MESSAGES.LOGOUT_SUCCESS,
      metadata: await AccessService.logout(req.keyStore)
    }).send(res);
  }
}

module.exports = new AccessController();