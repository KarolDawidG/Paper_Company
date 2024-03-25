import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";

interface Basket {
  id: string;
  order_id: string;
  product_id: string;
  quantity: string;
}

class BasketRecord {
  constructor(private orderData: Basket) {}

  static async insert(formData: { quantity: any; product_id: any; order_id: any }) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(
        "INSERT INTO order_details (id, order_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        [
          id,
          formData.order_id,
          formData.product_id,
          formData.quantity
        ]
      );
      return id;
    });
  }
}

export { BasketRecord };
