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
  UPDATE_USER_DATA_BY_ID,
  SELECT_BY_ROLE,
} from "./querryUsersRecord";

interface IUserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  img_url: string;
  created_at: string;
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
  created_at: string;

  constructor(obj: IUserRecord) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.role = obj.role;
    this.img_url = obj.img_url;
    this.created_at = obj.created_at;
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

  static async updateRole(role: string, id: string) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_ROLE, [role, id]);
      return results;
    });
  }

  static async listAll() {
    const [results] = (await pool.execute(SELECT_ALL)) as RowDataPacket[];
    return results.map((obj: any) => new UsersRecord(obj));
  }

  static async listByRole(role: string) {
    try {
      const [results] = await pool.execute(SELECT_BY_ROLE, [role]) as any;
      return results.map((obj: any) => new UsersRecord(obj));
    } catch (error) {
      console.error("Error in listByRole:", error);
      throw error;
    }
  }
  
  static async selectByEmail(email: string[]) {
    const [results] = await pool.execute(SELECT_BY_EMAIL, email);
    return results;
  }

  static async selectById(id:string) {
    try {
      const [results] = await pool.execute(SELECT_BY_ID, [id]) as any;
      return results.map((obj: any) => new UsersRecord(obj));
    } catch (error) {
      console.error("Error in selectById:", error);
      throw error;
    }
  }

  static async selectByUsername(username: string[]) {
    const [results] = await pool.execute(SELECT_BY_USERNAME, username);
    return results;
  }

  static async selectTokenById(id: string[]) {
    const [results] = await pool.execute(SELECT_TOKEN_BY_ID, id);
    return results;
  }

  static async updateImgUrl(id: string, img_url: string): Promise<any> {
    try {
      return await performTransaction(async (connection) => {
        const [results] = await connection.execute(UPDATE_IMG_URL_BY_ID, [img_url, id]);
        return results;
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
      "https://utfs.io/f/0576a965-e83c-47aa-b5b1-31aeac3c55c0-kmjf4x.jpg";
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_IMG_URL_BY_ID, [
        standardUrl,
        id,
      ]);
      return results;
    });
  }

  static async updateUserData([username, email, id]: [string, string, string]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_USER_DATA_BY_ID, [
        username,
        email,
        id,
      ]);
      return results;
    });
  }

}

export { UsersRecord };
