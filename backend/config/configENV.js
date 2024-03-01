require("dotenv").config();

module.exports = {
  hostDB: process.env.HOST_DB,
  nameDB: process.env.NAME_DB,
  userDB: process.env.USER_DB,
  passDB: process.env.PASS_DB,
  pass: process.env.pass,
  user: process.env.user,
  service: process.env.service,
  JWT_CONFIRMED_TOKEN: process.env.JWT_CONFIRMED_TOKEN,
  REACT_APP_SECRET_KEY: process.env.REACT_APP_SECRET_KEY,
  jwt_secret: process.env.jwt_secret,
};
