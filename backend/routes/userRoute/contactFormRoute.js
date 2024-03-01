const express = require("express");
const middleware = require("../../config/middleware");
const { errorHandler } = require("../../config/config");
const router = express.Router();
const MESSAGES = require("../../config/messages");
const STATUS_CODES = require("../../config/status-codes");
const logger = require("../../logs/logger");
const { sendContactEmail } = require("../../config/emailSender");

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req, res) => {
  const { name, email, subject, message} = req.body;

  await sendContactEmail(name, email, subject, message);

  try {
    logger.info("An E-mail has been sent!");
    res.status(STATUS_CODES.SUCCESS).send("An E-mail has been sent!");
  } catch (error) {
    logger.error(`Server error contact route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

module.exports = router;
