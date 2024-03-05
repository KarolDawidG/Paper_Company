import { RowDataPacket } from "mysql2/promise";
import { pool } from "../../pool";
import { performTransaction } from "../performTransaction";
import { validateEmail, validateUserName } from "../../../config/config";
import { v4 as uuidv4 } from "uuid";
import {
  INSERT,
  ACTIVE,
  DELETE,
  UPDATE_BY_ID,
  UPDATE_ROLE,
  SELECT_ALL,
  SELECT_BY_EMAIL,
  SELECT_BY_ID,
  SELECT_BY_USERNAME,
  UPDATE_TOKEN_BY_ID,
  SELECT_TOKEN_BY_ID,
  UPDATE_IMG_URL_BY_ID,
  SELECT_URL_BY_ID,
} from "./querryUsersRecord";

interface IUserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  img_url: string;
}

interface IQueryResult {
  affectedRows: number;
}

class UsersRecord implements IUserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  img_url: string;

  constructor(obj: IUserRecord) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.role = obj.role;
    this.img_url = obj.img_url;
  }

  static async insert(username: string, hashPassword: string, email: string) {
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

  static async activateAccount(id: string): Promise<IQueryResult> {
    return performTransaction(async (connection) => {
      const results = await connection.execute(ACTIVE, [id]);
      return results;
    });
  }

  static async delete(id: string) {
    return performTransaction(async (connection) => {
      const result = await connection.execute(DELETE, [id]);
      return result;
    });
  }

  static async updatePasswordById([hashPassword, id]: [string, string]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_BY_ID, [
        hashPassword,
        id,
      ]);
      return results;
    });
  }

  static async updateRefreshTokenById([refreshToken, id]: [string, string]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_TOKEN_BY_ID, [
        refreshToken,
        id,
      ]);
      return results;
    });
  }

  static async updateRole(role: string, username: string) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_ROLE, [role, username]);
      return results;
    });
  }

  static async listAll() {
    const [results] = (await pool.execute(SELECT_ALL)) as RowDataPacket[];
    return results.map((obj: any) => new UsersRecord(obj));
  }

  static async selectByEmail(email: string[]) {
    const [results] = await pool.execute(SELECT_BY_EMAIL, email);
    return results;
  }

  static async selectById(id: string[]) {
    const [results] = await pool.execute(SELECT_BY_ID, id);
    return results;
  }

  static async selectByUsername(username: string[]) {
    const [results] = await pool.execute(SELECT_BY_USERNAME, username);
    return results;
  }

  static async selectTokenById(id: string[]) {
    const [results] = await pool.execute(SELECT_TOKEN_BY_ID, id);
    return results;
  }

  static async updateImgUrl(id: string, img_url: string): Promise<void> {
    try {
      await performTransaction(async (connection) => {
        const results = await connection.execute(UPDATE_IMG_URL_BY_ID, [
          img_url,
          id,
        ]);
      });
    } catch (error) {
      throw error;
    }
  }

  static async selectUrlById(id: string[]) {
    const [results] = await pool.execute(SELECT_URL_BY_ID, id);
    return results;
  }

  static async deleteUrl(id: string) {
    const standardUrl =
      "https://utfs.io/f/8c5ed6b4-9c43-49a9-b7be-e1096fc07f0f-kmjf4x.jpg";
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_IMG_URL_BY_ID, [
        standardUrl,
        id,
      ]);
      return results;
    });
  }
}

export { UsersRecord };
