const { pool } = require("../../pool");
const { performTransaction } = require("../performTransaction");
const { validateEmail, validateUserName } = require("../../../config/config");
const { v4: uuidv4 } = require("uuid");
const {
  INSERT,
  ACTIVE,
  DELETE,
  UPDATE_BY_ID,
  UPDATE_ROLE,
  SELECT_ALL,
  SELECT_BY_EMAIL,
  SELECT_BY_ID,
  SELECT_BY_USERNAME,
  UPDATE_TOKEN_BY_ID
} = require("./querryUsersRecord");

class UsersRecord {
  constructor(obj) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.role = obj.role;
  }

  static async insert(username, hashPassword, email) {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address.");
    }
    if (!validateUserName(username)) {
      throw new Error("Invalid username.");
    }
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(INSERT, [id, username, hashPassword, email]);
      return id;
    });
  }

  static async activateAccount(id) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(ACTIVE, [id]);
      return results;
    });
  }

  static async delete(id) {
    return performTransaction(async (connection) => {
      const result = await connection.execute(DELETE, [id]);
      return result;
    });
  }

  static async updatePasswordById([hashPassword, id]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_BY_ID, [
        hashPassword,
        id,
      ]);
      return results;
    });
  }

  static async updateRefreshTokenById([refreshToken, id]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_TOKEN_BY_ID, [
        refreshToken,
        id,
      ]);
      return results;
    });
  }

  static async updateRole(role, username) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_ROLE, [role, username]);
      return results;
    });
  }

  static async listAll() {
    const [results] = await pool.execute(SELECT_ALL);
    return results.map((obj) => new UsersRecord(obj));
  }

  static async selectByEmail(email) {
    const [results] = await pool.execute(SELECT_BY_EMAIL, email);
    return results;
  }

  static async selectById(id) {
    const [results] = await pool.execute(SELECT_BY_ID, id);
    return results;
  }

  static async selectByUsername(username) {
    const [results] = await pool.execute(SELECT_BY_USERNAME, username);
    return results;
  }
}

module.exports = {
  UsersRecord,
};
