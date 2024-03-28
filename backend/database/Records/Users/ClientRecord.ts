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
}

export { ClientRecord };
