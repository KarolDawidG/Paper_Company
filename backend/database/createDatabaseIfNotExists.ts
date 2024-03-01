import { Pool, RowDataPacket, FieldPacket } from "mysql2/promise";
import 'dotenv/config';
import { pool } from "./pool";

const nameDB = process.env.NAME_DB as string;

const checkDatabaseExists = async (pool: Pool, nameDB: string): Promise<boolean> => {
  try {
    const [rows] = await pool.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [nameDB]
    ) as [RowDataPacket[], FieldPacket[]];

    return rows.length > 0;
  } catch (err) {
    console.error(`Error checking database "${nameDB}":`, err);
    throw err;
  }
};

const createDatabaseIfNotExists = async (): Promise<void> => {
  try {
    const exists = await checkDatabaseExists(pool, nameDB);
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

export {
  createDatabaseIfNotExists,
};
