import { Pool, PoolConnection } from 'mysql2/promise';
import { pool } from "../pool"; 

type CallbackFunction = (connection: PoolConnection) => Promise<any>;

const performTransaction = async (callback: CallbackFunction): Promise<any> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result:any = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export { performTransaction };