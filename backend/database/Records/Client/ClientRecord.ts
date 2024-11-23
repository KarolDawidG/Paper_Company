import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";
import {DELETE_CLIENT, CLIENT_ORDER_DATA, INSERT_CLIENT, SELECT_CLIENT_BY_ID, SELECT_CLIENTS, UPDATE_CLIENT} from "./querryClientRecord";
import { Client } from "./InterfaceClient";

class ClientRecord implements Client {
  id: string;
  first_name: string;
  second_name: string;
  email: string;
  company_name: string;
  created_at: string;

  constructor(obj: Client) {
    this.id = obj.id;
    this.first_name = obj.first_name;
    this.second_name = obj.second_name;
    this.email = obj.email;
    this.company_name = obj.company_name;
    this.created_at = obj.created_at;
  }


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
        const [results] = await pool.execute(`SELECT nazwa_firmy, miasto, kod, ulica, nr_budynku, nr_mieszkania FROM \`client_addresses\` WHERE id = ?;`, id);
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
            formData.email,
            formData.company_name
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

    static async updateClient([id, first_name, second_name, email]: [string, string, string, string]): Promise<any> {
      return performTransaction(async (connection) => {
          const [result] = await connection.execute(UPDATE_CLIENT, [first_name, second_name, email, id]);
          return result;
      });
  }
    
    static async getClientData(clientID: string, addressID:string) {
      const [results] = await pool.execute(CLIENT_ORDER_DATA, [clientID, addressID]);
      return results;
  }


  static async getClientDataById(id: string[]) {
    const [results] = await pool.execute(`select * from clients WHERE id = ?;
`, id);
    return results;
}
}


export { ClientRecord };
