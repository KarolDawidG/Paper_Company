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
  account_id: string;

  constructor(obj: Order) {
    this.id = obj.id;
    this.client_id = obj.client_id;
    this.client_address_id = obj.client_address_id;
    this.created_at = obj.created_at;
    this.status = obj.status;
    this.payment_status = obj.payment_status;
    this.payment_date = obj.payment_date;
    this.account_id = obj.account_id;
  }

    static async insert(client_id: string, client_address_id: string, account_id:string) {
        const id: string = uuidv4();

        return performTransaction(async (connection) => {
            await connection.execute(INSERT_ORDER,
                [
                    id,
                    client_id,
                    client_address_id,
                    account_id,
                ]
            );
            return id;
        });
    }
    
    static async getPendingList(): Promise<any[]> {
      const query = `
        SELECT 
          orders.id,
          orders.client_id,
          orders.client_address_id,
          orders.created_at,
          orders.status,
          orders.payment_status,
          orders.payment_date,
          clients.company_name
        FROM 
          orders
        JOIN 
          clients ON orders.client_id = clients.id
        WHERE 
          orders.status = 'pending';
      `;
  
      try {
        const [rows] = await pool.execute(query);
        return rows as any[];
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        throw new Error("Could not fetch orders.");
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

  static async updateStatus(orderId: string, newStatus: string): Promise<void> {
    const query = `
      UPDATE orders
      SET status = ?
      WHERE id = ?;
    `;
    
    try {
      await pool.execute(query, [newStatus, orderId]);
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
      throw new Error("Could not update order status.");
    }
  }

  static async getOrdersByStatus(status: string): Promise<any[]> {
    const query = `
      SELECT 
        orders.id,
        orders.client_id,
        orders.client_address_id,
        orders.created_at,
        orders.status,
        orders.payment_status,
        orders.payment_date,
        clients.company_name
      FROM 
        orders
      JOIN 
        clients ON orders.client_id = clients.id
      WHERE 
        orders.status = ?;
    `;

    try {
      const [rows] = await pool.execute(query, [status]);
      return rows as any[];
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw new Error("Could not fetch orders.");
    }
  }



static async updatePaymentStatus(orderId: string, newStatus: 'unpaid' | 'paid' | 'waiting'): Promise<void> {
  const query = `
    UPDATE orders
    SET payment_status = ?, 
        payment_date = CASE 
          WHEN ? = 'paid' THEN CURRENT_TIMESTAMP
          ELSE NULL 
        END
    WHERE id = ?;
  `;

  try {
    await pool.execute(query, [newStatus, newStatus, orderId]);
  } catch (error) {
    console.error(`Error updating payment status to ${newStatus} for order ${orderId}:`, error);
    throw new Error("Could not update payment status.");
  }
}

static async getOrderDetails(orderId: string): Promise<any> {
  const query = `
    SELECT 
      o.id AS order_id,
      o.created_at,
      o.status,
      o.payment_status,
      o.payment_date,
      o.account_id,
      
      c.id AS client_id,
      c.company_name,
      c.first_name,
      c.second_name,
      c.email,

      ca.ulica,
      ca.miasto,
      ca.kod,
      ca.nr_budynku,
      ca.nr_mieszkania,
      ca.nazwa_firmy,

      od.product_id,
      p.name AS product_name,
      pt.name AS translated_name,
      p.price,
      od.quantity

    FROM orders o
    JOIN clients c ON o.client_id = c.id
    JOIN client_addresses ca ON o.client_address_id = ca.id
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.language_id = 'pl'
    WHERE o.id = ?;
  `;

  try {
    const [results] = await pool.execute(query, [orderId]);
    return results;
  } catch (error) {
    console.error("Error in getOrderDetails:", error);
    throw new Error("Could not fetch order details.");
  }
}


}

export { OrdersRecord };
