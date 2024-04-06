import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";
import {pool} from "../../pool";

interface Client {
  id: string;
  first_name: string;
  second_name: string;
  email: string;
  created_at: string;
}

class ClientRecord {
  constructor(private clientData: Client) {}

    static async getList() {
        try {
            const [results] = await pool.execute("SELECT * FROM `clients`") as any;
            return results.map((obj: any) => new ClientRecord(obj));
        } catch (error) {
            console.error("Error in getListById:", error);
            throw error;
        }
    }

    static async insert(formData: Client) {
      const id = uuidv4();
  
      return performTransaction(async (connection) => {
        await connection.execute(
          "INSERT INTO clients (id, first_name, second_name, email) VALUES (?, ?, ?, ?)",
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
        const result = await connection.execute('DELETE FROM `clients` WHERE id = ?', [id]);
        return result;
      });
    }

    static async updateClient(first_name:string, second_name:string, email:string, id:string) {
      try {
        return performTransaction(async (connection) => {
          const results = await connection.execute("UPDATE `clients` SET first_name = ?, second_name = ?, email = ? WHERE id = ?", [
            first_name,
            second_name,
            email,
            id,
          ]);
          return results;
        });
      } catch (error) {
        console.log(error);
        console.error("Error updating client:", error);
        throw new Error("Error updating client");
      }
    }
    

}


export { ClientRecord };
