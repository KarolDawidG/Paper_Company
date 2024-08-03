import { Pool, RowDataPacket } from "mysql2/promise";
import {
  insertRoot,
  findRoot,
  createAccounts,
  createClientAddresses,
  createOrderDetails,
  deleteNotActiveAccount,
  event_schedulerON,
  createOrders,
  createProducts,
  createClients,
  createproductTranslations,
  createLanguage,
} from "./querrys";

const createproductTranslationsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createproductTranslations);
  } catch (err) {
    console.error(err);
  }
};

const createLanguageTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createLanguage);
  } catch (err) {
    console.error(err);
  }
};

const createTransactionOrdersDetails = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createOrderDetails);
  } catch (err) {
    console.error(err);
  }
};

const createClientsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createClients);
  } catch (err) {
    console.error(err);
  }
};
const createClientsAddressTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createClientAddresses);
  } catch (err) {
    console.error(err);
  }
};

const createAccountsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createAccounts);
  } catch (err) {
    console.error(err);
  }
};

const createTransactionOrders = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createOrders);
  } catch (err) {
    console.error(err);
  }
};

const createTransactionProducts = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createProducts);
  } catch (err) {
    console.error(err);
  }
};

const deleteAccount = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(deleteNotActiveAccount);
  } catch (err) {
    console.error(err);
  }
};

const eventSchedulerON = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(event_schedulerON);
  } catch (err) {
    console.error(err);
  }
};

const createRoot = async (pool: Pool): Promise<void> => {
  try {
    const [rows] = await pool.query(findRoot);
    // Sprawdzenie, czy wynik jest tablicą RowDataPacket
    if (Array.isArray(rows) && (rows as RowDataPacket[]).length === 0) {
      await pool.query(insertRoot);
      console.log("User root (pass: Admin12#) has been added.");
    } else {
      console.log("User root status: 1");
    }
  } catch (err) {
    console.error(err);
  }
};

export { 
  createClientsTable, 
  createClientsAddressTable, 
  createTransactionOrdersDetails, 
  createTransactionProducts, 
  createAccountsTable, 
  createproductTranslationsTable,
  createLanguageTable,
  createTransactionOrders, 
  createRoot, 
  deleteAccount, 
  eventSchedulerON };
