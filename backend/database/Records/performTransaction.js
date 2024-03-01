const { pool } = require("../pool");

const performTransaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  performTransaction,
};
