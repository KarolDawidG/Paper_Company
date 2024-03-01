const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UsersRecord } = require("../../database/Records/Users/UsersRecord");
const {
  errorHandler,
  limiterLogin,
  queryParameterize,
} = require("../../config/config");
const middleware = require("../../config/middleware");
const {
  SECRET_REFRESH_TOKEN,
  generateRefreshToken,
  generateToken,
} = require("../../config/tokenUtils");
const MESSAGES = require("../../config/messages");
const STATUS_CODES = require("../../config/status-codes");
const logger = require("../../logs/logger");
const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", limiterLogin, async (req, res) => {
  try {
    const user = req.body.username;
    const password = req.body.password;

    if (!user || !password) {
      return res
        .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }
    if (!user.match(queryParameterize)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(MESSAGES.SQL_INJECTION_ALERT);
    }

    const ifUser = await UsersRecord.selectByUsername([user]);
    const idUser = ifUser[0].id;
    
    if (ifUser.length === 0) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    if (!ifUser[0].is_active) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
    }

    const hashedPassword = ifUser[0].password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    const rola = ifUser[0].role;
    logger.info(`Logged in user: ${user}, access level: ${rola}`);

    const token = generateToken(user, rola);
    const refreshToken = generateRefreshToken(user, rola);
    
    await UsersRecord.updateRefreshTokenById([refreshToken, idUser]);
    
    return res.status(STATUS_CODES.SUCCESS).json({
      token: token,
      refreshToken: refreshToken,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(MESSAGES.INTERNET_DISCONNECTED);
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: MESSAGES.NO_REFRESH_TOKEN });
  }
  jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
    const username = decoded.user;
    const role = decoded.role;

    const newToken = generateToken(username, role);
    const refreshToken = generateRefreshToken(username, role);
    return res.json({ token: newToken, refreshToken: refreshToken });
  });
});

module.exports = router;
