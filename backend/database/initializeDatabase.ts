import "dotenv/config";
import { pool } from "./pool";
import logger from "../logs/logger";

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
    // 27.11.5: Końcowy status inicjalizacji DB trafia do wspólnego loggera zamiast do konsoli.
    logger.info("Database initialized successfully.");
  } catch (err) {
    logger.error("Database initialization failed: %s", err);
  }
};

export { initializeDatabase };
