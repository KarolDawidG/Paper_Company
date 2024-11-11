import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";
import {DELETE_ORDER, INSERT_ORDER, SELECT_ORDERS, SELECT_PENDING_ORDERS} from "./querryOrderRecord";
import { Order } from "./InterfaceOrder";

class OrdersRecord implements Order {
  id: string;
  client_id: string;
  client_address_id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_date: string;

  constructor(obj: Order) {
    this.id = obj.id;
    this.client_id = obj.client_id;
    this.client_address_id = obj.client_address_id;
    this.created_at = obj.created_at;
    this.status = obj.status;
    this.payment_status = obj.payment_status;
    this.payment_date = obj.payment_date;
  }

    static async insert(client_id: string, client_address_id: string) {
        const id: string = uuidv4();

        return performTransaction(async (connection) => {
            await connection.execute(INSERT_ORDER,
                [
                    id,
                    client_id,
                    client_address_id,
                ]
            );
            return id;
        });
    }
    
  static async getPendingList() {
    try {
      const [results] = await pool.execute(SELECT_PENDING_ORDERS) as any;
      return results.map((obj: any) => new OrdersRecord(obj));
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  }
  static async getList() {
    try {
      const [results] = await pool.execute(SELECT_ORDERS) as any;
      return results.map((obj: any) => new OrdersRecord(obj));
    } catch (error) {
      console.error("Error in getList:", error);
      throw error;
    }
  }

  static async delete(id: string) {
    return performTransaction(async (connection) => {
        return await connection.execute(DELETE_ORDER, [id]);
    });
  }

  static async quantityAndItems(orderId: string) {
    const query = `
      SELECT 
        p.id AS product_id, p.name AS product_name, p.price, od.quantity
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      WHERE od.order_id = ?;
    `;

    try {
      const [results] = await pool.execute(query, [orderId]) as any;
      return results;
    } catch (error) {
      console.error("Error in quantityAndItems:", error);
      throw error;
    }
  }

  static async updateStatusToShipped(orderId: string): Promise<void> {
    const query = `
      UPDATE orders
      SET status = 'shipped'
      WHERE id = ?;
    `;
    
    try {
      await pool.execute(query, [orderId]);
    } catch (error) {
      console.error("Error updating order status to shipped:", error);
      throw new Error("Could not update order status.");
    }
  }

}

export { OrdersRecord };
