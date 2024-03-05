import { Pool, RowDataPacket } from "mysql2/promise";
import {
  insertRoot,
  findRoot,
  createAccounts,
  deleteNotActiveAccount,
  event_schedulerON,
} from "./querrys";

const createAccountsTable = async (pool: Pool): Promise<void> => {
  try {
    await pool.query(createAccounts);
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

export { createAccountsTable, createRoot, deleteAccount, eventSchedulerON };
