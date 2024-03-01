const jwt = require("jsonwebtoken");
const TOKEN_EXPIRATION_TIME = "1m";
const crypto = require("crypto");
const SECRET_REFRESH_TOKEN = crypto.randomBytes(32).toString("hex");
const REFRESH_TOKEN_EXPIRATION = "7d";
const fs = require("fs");
const privateKey = fs.readFileSync("./klucze/privateKey.pem", "utf8");

const generateToken = (username, rola) => {
  const payload = {
    user: username,
    role: rola,
    exp:
      Math.floor(Date.now() / 1000) +
      parseInt(TOKEN_EXPIRATION_TIME.split("m")[0]) * 60 * 60,
  };
  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};

const generateRefreshToken = (username, rola) => {
  const payload = {
    user: username,
    role: rola,
  };
  return jwt.sign(payload, SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  TOKEN_EXPIRATION_TIME,
  SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION,
};
