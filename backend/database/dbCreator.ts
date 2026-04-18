import { Pool, RowDataPacket } from "mysql2/promise";
import logger from "../logs/logger";
import {
  insertRoot,
  findRoot,
  createAccounts,
  createEmployee,
  createClientAddresses,
  createOrderDetails,
  deleteNotActiveAccount,
  createOrders,
  createProducts,
  createClients,
  createproductTranslations,
  createLanguage,
} from "./querrys";

const createEmployeeTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createEmployee);
  } catch (err) {
    // 27.11.8: Tworzenie struktur DB używa wspólnego loggera, żeby błędy migracyjne miały ten sam format co reszta backendu.
    logger.error("Failed to create employees table: %s", err);
  }
};

const createproductTranslationsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createproductTranslations);
  } catch (err) {
    logger.error("Failed to create product translations table: %s", err);
  }
};

const createLanguageTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createLanguage);
  } catch (err) {
    logger.error("Failed to create languages table: %s", err);
  }
};

const createTransactionOrdersDetails = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createOrderDetails);
  } catch (err) {
    logger.error("Failed to create order details table: %s", err);
  }
};

const createClientsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createClients);
  } catch (err) {
    logger.error("Failed to create clients table: %s", err);
  }
};
const createClientsAddressTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createClientAddresses);
  } catch (err) {
    logger.error("Failed to create client addresses table: %s", err);
  }
};

const createAccountsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createAccounts);
  } catch (err) {
    logger.error("Failed to create accounts table: %s", err);
  }
};

const createTransactionOrders = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createOrders);
  } catch (err) {
    logger.error("Failed to create orders table: %s", err);
  }
};

const createTransactionProducts = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createProducts);
  } catch (err) {
    logger.error("Failed to create products table: %s", err);
  }
};

const deleteAccount = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(deleteNotActiveAccount);
  } catch (err) {
    logger.error("Failed to create cleanup event for inactive accounts: %s", err);
  }
};

// const eventSchedulerON = async (pool: Pool): Promise<void> => {
//   try {
//     await pool.query(event_schedulerON);
//   } catch (err) {
//     logger.error("Failed to enable event scheduler: %s", err);
//   }
// };

const createRoot = async (pool: Pool): Promise<void> => {
  try {
    const [rows] = await pool.query(findRoot);
    // Sprawdzenie, czy wynik jest tablicą RowDataPacket
    if (Array.isArray(rows) && (rows as RowDataPacket[]).length === 0) {
      await pool.query(insertRoot);
      logger.warn("User root (pass: Admin12#) has been added.");
    } else {
      logger.info("User root status: 1");
    }
  } catch (err) {
    logger.error("Failed to ensure root user exists: %s", err);
  }
};

export { 
  createClientsTable, 
  createEmployeeTable,
  createClientsAddressTable, 
  createTransactionOrdersDetails, 
  createTransactionProducts, 
  createAccountsTable, 
  createproductTranslationsTable,
  createLanguageTable,
  createTransactionOrders, 
  createRoot, 
  deleteAccount };
