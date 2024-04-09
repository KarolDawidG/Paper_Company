import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";

interface Address {
  id: string;
  client_id: string;
  miasto: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
  kod: string;
  nazwa_firmy: string;
}

class AddressRecord {
  constructor(private addressData: Address) {}

  static async insert(formData: Address) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(
        "INSERT INTO client_addresses (id, client_id, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          formData.client_id,
          formData.miasto,
          formData.ulica,
          formData.nr_budynku,
          formData.nr_mieszkania,
          formData.kod,
          formData.nazwa_firmy
        ]
      );
      return id;
    });
  }

  static async getListById(id:string) {
    try {
      const [results] = await pool.execute("SELECT * FROM `client_addresses` WHERE client_id = ?", [id]) as any;
      return results.map((obj: any) => new AddressRecord(obj));
    } catch (error) {
      console.error("Error in getListById:", error);
      throw error;
    }
  }

  static async delete(id: string) {
    return performTransaction(async (connection) => {
        return connection.execute('DELETE FROM `client_addresses` WHERE id = ?', [id]);
    });
  }

}

export { AddressRecord };
