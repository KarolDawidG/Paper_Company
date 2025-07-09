import "dotenv/config";
import { pool } from "./pool";

const nameDB = process.env.NAME_DB;

import {
  createAccountsTable,
  createTransactionOrders,
  createTransactionProducts,
  createRoot,
  deleteAccount,
  createEmployeeTable,
  
  createClientsTable,
  createClientsAddressTable,
  createTransactionOrdersDetails,
  createproductTranslationsTable,
  createLanguageTable,
} from "./dbCreator";

const initializeDatabase = async () => {
  try {
    await pool.query(`USE ${nameDB}`);
    const tables = [
      createAccountsTable,
      createEmployeeTable,
      createRoot,
      deleteAccount,
      
      createClientsTable,
      createClientsAddressTable,
      createTransactionOrders,
      createTransactionProducts,
      createTransactionOrdersDetails,
      createLanguageTable,
      createproductTranslationsTable,
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
