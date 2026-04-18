import { Pool, RowDataPacket, FieldPacket } from "mysql2/promise";
import "dotenv/config";
import { pool } from "./pool";
import logger from "../logs/logger";

const nameDB = process.env.NAME_DB as string;

const checkDatabaseExists = async (
  pool: Pool,
  nameDB: string,
): Promise<boolean> => {
  try {
    const [rows] = (await pool.query(`SHOW DATABASES LIKE ?`, [nameDB])) as [
      RowDataPacket[],
      FieldPacket[],
    ];
    return rows.length > 0;
  } catch (err) {
    logger.error('Error checking database "%s": %s', nameDB, err);
    throw err;
  }
};

const createDatabaseIfNotExists = async (): Promise<void> => {
  try {
    // 27.11.4: Inicjalizacja bazy zapisuje status przez winston, żeby logi startowe były spójne z resztą backendu.
    logger.info('Checking if database "%s" exists...', nameDB);
    const exists = await checkDatabaseExists(pool, nameDB);
    if (!exists) {
      logger.warn('Database "%s" does not exist, creating...', nameDB);
      await pool.query(`CREATE DATABASE IF NOT EXISTS \`${nameDB}\``);
      // await pool.query(`USE ${nameDB}`);
      logger.info('Database "%s" has been created.', nameDB);
    } else {
      logger.info('Database "%s" already exists, no need to create.', nameDB);
    }
  } catch (err) {
    logger.error('Error creating/checking database "%s": %s', nameDB, err);
  }
};

export { createDatabaseIfNotExists };
