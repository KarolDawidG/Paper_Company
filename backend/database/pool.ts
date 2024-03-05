import "dotenv/config";
import { createPool } from "mysql2/promise";

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  namedPlaceholders: boolean;
  decimalNumbers: boolean;
}

const dbConfig: DbConfig = {
  host: process.env.HOST_DB || "",
  user: process.env.USER_DB || "",
  password: process.env.PASS_DB || "",
  database: process.env.NAME_DB || "",
  namedPlaceholders: true,
  decimalNumbers: true,
};

const pool = createPool(dbConfig);

export { pool };
