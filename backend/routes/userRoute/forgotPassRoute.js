const express = require("express");
const jwt = require("jsonwebtoken");
const middleware = require("../../config/middleware");
const { errorHandler } = require("../../config/config");
const { UsersRecord } = require("../../database/Records/Users/UsersRecord");
const router = express.Router();
const MESSAGES = require("../../config/messages");
const STATUS_CODES = require("../../config/status-codes");
const URL = require("../../config/url");
const logger = require("../../logs/logger");
const { sendResetPasswordEmail } = require("../../config/emailSender");

require('dotenv').config();
const jwt_secret = process.env.jwt_secret;

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req, res) => {
  const { email } = req.body;
  let usernameReset = "";
  let idReset = "";
  let emailReset = "";
  let passwordReset = "";
  try {
    const [emailExists] = await UsersRecord.selectByEmail([email]);
    if (!emailExists || emailExists.length === 0) {
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
    }
    usernameReset = emailExists?.username;
    emailReset = emailExists?.email;
    idReset = emailExists?.id;
    passwordReset = emailExists?.password;
  } catch (error) {
    logger.error(error.message);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
  const secret = jwt_secret + passwordReset;
  const payload = {
    email: emailReset,
    id: idReset,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1m" });
  const link = `${URL.RESET_URL}${idReset}/${token}`;

  await sendResetPasswordEmail(emailReset, usernameReset, link);

  try {
    logger.info(MESSAGES.EMAIL_SUCCESS);
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
  } catch (error) {
    logger.error(`Server error email route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

module.exports = router;
