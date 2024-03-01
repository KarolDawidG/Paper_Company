const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const MESSAGES = require("./messages");
const STATUS_CODES = require("./status-codes");
const logger = require("../logs/logger");
const fs = require("fs");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  logger.error(err.message);
  if (err instanceof SyntaxError) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_REQUEST);
  } else {
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.UNKNOW_ERROR);
  }
};

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, //5 minutes
  max: 1000, // limit each IP to 100 per windowMs
});

const limiterLogin = rateLimit({
  windowMs: 5 * 60 * 1000, //5 minutes
  max: 50,
});

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },


});

  if (!fs.existsSync("./klucze")) {
    fs.mkdirSync("./klucze");
  }

fs.writeFileSync("./klucze/privateKey.pem", privateKey);
fs.writeFileSync("./klucze/publicKey.pem", publicKey);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.USER_NOT_LOGGED_IN);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      logger.info(MESSAGES.JWT_ERROR);
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.SESSION_EXPIRED);
    }
    const userRole = decoded.role;
    req.userRole = userRole;
    req.user = decoded;
    next();
  });
};

const queryParameterize = /^[A-Za-z0-9]+$/;

const validateEmail = (e) => {
  const email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return email.test(e);
};

const validatePassword = (e) => {
  if (e.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(e)) {
    return false;
  }
  if (!/[0-9]/.test(e)) {
    return false;
  }
  return true;
};

const validateUserName = (e) => {
  if (e.length >= 6 && e.length <= 16) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  errorHandler,
  limiter,
  limiterLogin,
  queryParameterize,
  validateEmail,
  validatePassword,
  validateUserName,
  verifyToken,
};
