const { pool } = require("./pool");
require('dotenv').config();
const nameDB = process.env.NAME_DB;

const checkDatabaseExists = async (nameDB) => {
  try {
    const [rows] = await pool.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [nameDB]
    );
    return rows.length > 0;
  } catch (err) {
    console.error(`Error checking database "${nameDB}":`, err);
    throw err;
  }
};

const createDatabaseIfNotExists = async () => {
  try {
    const exists = await checkDatabaseExists(nameDB);
    if (!exists) {
      await pool.query(`CREATE DATABASE IF NOT EXISTS \`${nameDB}\``);
      console.log(`Database "${nameDB}" has been created.`);
    } else {
      console.log(`Database "${nameDB}" already exists, no need to create.`);
    }
  } catch (err) {
    console.error(`Error creating/checking database "${nameDB}":`, err);
  }
};


module.exports = {
  createDatabaseIfNotExists,
};
