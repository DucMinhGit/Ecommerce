'use strict'

const AccessService = require("../services/access.service");
const { MESSAGES } = require('../utils/const');
const { Created } = require('../core/success.response');

class AccessController {
  signUp = async (req, res, next) => {
    new Created({
      message: MESSAGES.REGISTER_SUCCESS,
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

module.exports = new AccessController();