'use strict'

const AccessService = require("../services/access.service");
const { MESSAGES } = require('../utils/const');
const { Created, SuccessResponse } = require('../core/success.response');
const { NotFoundError } = require("../core/error.response");

class AccessController {

  handlerRefreshToken = async (req, res, next) => {
    if (!req.refreshToken) throw new NotFoundError(req.refreshToken);

    new SuccessResponse({
      message: MESSAGES.REFRESH_TOKEN_SUCCESS,
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res);
  }

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