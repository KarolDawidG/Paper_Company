import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";

interface Order {
    id: string;
    client_id: string;
    client_address_id: string;
}

class OrdersRecord {
  constructor(private orderData: Order) {}

    static async insert(client_id: string, client_address_id: string) {
        const id: string = uuidv4();

        return performTransaction(async (connection) => {
            await connection.execute(
                "INSERT INTO orders (id, client_id, client_address_id ) VALUES (?, ?, ?)",
                [
                    id,
                    client_id,
                    client_address_id,
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
        return await connection.execute('DELETE FROM `orders` WHERE id = ?', [id]);
    });
  }

}

export { OrdersRecord };
