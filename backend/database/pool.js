require('dotenv').config();
const { createPool } = require("mysql2/promise");

const pool = createPool({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASS_DB,
  namedPlaceholders: true,
  decimalNumbers: true,
});

module.exports = {
  pool,
};

