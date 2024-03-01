const { pool } = require("./pool");
require('dotenv').config();

const nameDB = process.env.NAME_DB;

const {
  createAccountsTable,
  createRoot,
  deleteAccount,
  eventSchedulerON,
} = require("./dbCreator");


const initializeDatabase = async () => {
  try {
    
    await pool.query(`USE ${nameDB}`);
    const tables = [
      createAccountsTable,
      createRoot,
      deleteAccount,
      eventSchedulerON,
    ];
    for await (const table of tables) {
      await table(pool);
    }
    console.log("Database started correctly");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  initializeDatabase,
};
