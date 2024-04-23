import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";
import {DELETE_CLIENT, INSERT_CLIENT, SELECT_CLIENT_BY_ID, SELECT_CLIENTS, UPDATE_CLIENT} from "./querryClientRecord";

interface Client {
  id: string;
  first_name: string;
  second_name: string;
  email: string;
  created_at: string;
}

class ClientRecord {
  constructor(private Data: Client) {}

    static async getList() {
        try {
            const [results] = await pool.execute(SELECT_CLIENTS) as any;
            return results.map((obj: any) => new ClientRecord(obj));
        } catch (error) {
            console.error("Error in getListById:", error);
            throw error;
        }
    }

    static async getAddress(id: string[]) {
        const [results] = await pool.execute(SELECT_CLIENT_BY_ID, id);
        return results;
    }

    static async insert(formData: Client) {
      const id = uuidv4();
      return performTransaction(async (connection) => {
        await connection.execute(INSERT_CLIENT,
          [
            id,
            formData.first_name,
            formData.second_name,
            formData.email
          ]
        );
        return id;
      });
    }

    static async delete(id: string) {
      return performTransaction(async (connection) => {
          await connection.execute("DELETE FROM `client_addresses` WHERE client_id = ?", [id]);
          return connection.execute("DELETE FROM `clients` WHERE id = ?", [id]);
      });
  }

    static async updateClient([id, first_name, second_name, email]: [string, string, string, string]) {
        return performTransaction(async (connection) => {
            return connection.execute(UPDATE_CLIENT, [first_name, second_name, email, id]);
        });
    }
}


export { ClientRecord };
