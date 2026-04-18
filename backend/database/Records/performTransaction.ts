import { PoolConnection } from "mysql2/promise";
import { pool } from "../pool";
import logger from "../../logs/logger";

type CallbackFunction = (connection: PoolConnection) => Promise<any>;

const performTransaction2 = async (callback: CallbackFunction): Promise<any> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result: any = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const performTransaction = async (callback: CallbackFunction): Promise<any> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result: any = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      // 27.11.9: Błędy rollbacku są krytyczne diagnostycznie, więc trafiają do winston z wyraźnym komunikatem.
      logger.error("Rollback error: %s", rollbackError);
    }
    throw error;
  } finally {
    connection.release();
  }
};


export { performTransaction };
