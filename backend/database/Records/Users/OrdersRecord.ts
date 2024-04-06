import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../../pool";

interface Order {
  id: string;
  client_id: string;
  miasto: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
  kod: string;
  nazwa_firmy: string;
  account_id: string;
}

class OrdersRecord {
  constructor(private orderData: Order) {}

  static async insert(formData: Order) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(
        "INSERT INTO orders (id, client_id, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
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

  static async getListById() {
    try {
      const [results] = await pool.execute("SELECT * FROM `orders`") as any;
      return results.map((obj: any) => new OrdersRecord(obj));
    } catch (error) {
      console.error("Error in getListById:", error);
      throw error;
    }
  }

  static async delete(id: string) {
    return performTransaction(async (connection) => {
      const result = await connection.execute('DELETE FROM `orders` WHERE id = ?', [id]);
      return result;
    });
  }

}

export { OrdersRecord };
