'use strict'

const AccessService = require("../services/access.service");
const { CODES } = require('../utils/const');

class AccessController {
  signUp = async (req, res, next) => {
    return res.status(CODES.CREATED).json(await AccessService.signUp(req.body));
  }
}

module.exports = new AccessController();