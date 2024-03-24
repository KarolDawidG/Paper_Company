import "dotenv/config";
import { pool } from "./pool";

const nameDB = process.env.NAME_DB;

import {
  createAccountsTable,
  createTransactionOrders,
  createTransactionProducts,
  createRoot,
  deleteAccount,
  eventSchedulerON,
  createClientsTable,
  createTransactionOrdersDetails,
} from "./dbCreator";

const initializeDatabase = async () => {
  try {
    await pool.query(`USE ${nameDB}`);
    const tables = [
      createAccountsTable,
      createTransactionOrders,
      createTransactionProducts,
      createTransactionOrdersDetails,
      createRoot,
      deleteAccount,
      eventSchedulerON,
      createClientsTable,
    ];
    for await (const table of tables) {
      await table(pool);
    }
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error(err);
  }
};

export { initializeDatabase };
