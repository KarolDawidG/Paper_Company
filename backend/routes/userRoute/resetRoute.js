const express = require("express");
require('dotenv').config();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("../../config/middleware");
const { limiter, errorHandler } = require("../../config/config");
const { UsersRecord } = require("../../database/Records/Users/UsersRecord");
const logger = require("../../logs/logger");
const MESSAGES = require("../../config/messages");
const STATUS_CODES = require("../../config/status-codes");
const { validatePassword } = require("../../config/config");

const jwt_secret = process.env.jwt_secret;

router.use(middleware);
router.use(limiter);
router.use(errorHandler);

router.get("/:id/:token", (req, res) => {
  try {
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    logger.error(error);
  }
});

router.post("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  let oldPasword = "";

  if (password !== password2) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
  }

  if (!validatePassword(password)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
  }

  try {
    const [user] = await UsersRecord.selectById([id]);
    oldPasword = user?.password;

    const secret = jwt_secret + oldPasword;
    const payload = jwt.verify(token, secret);

    const hashPassword = await bcrypt.hash(password, 10);

    await UsersRecord.updatePasswordById([hashPassword, id]);

    logger.info(MESSAGES.SUCCESSFUL_RESET);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.PASS_RESET);
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.JWT_ERROR);
  }
});

module.exports = router;
