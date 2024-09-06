import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";
import {INSERT_BASKET} from "./querryBasketRecord";
import { Basket } from "./InterfaceBasket";

class BasketRecord {
  constructor(private orderData: Basket) {}

  static async insert(formData: { quantity: any; product_id: any; order_id: any }) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(INSERT_BASKET,
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
