
import { pool } from "../../pool";

export class DataRecord {
  static async getTopProducts(langCode: string = 'pl'): Promise<{ name: string; quantity: number }[]> {
        const query = `
        SELECT MAX(COALESCE(pt.name, p.name)) AS name, SUM(od.quantity) AS quantity
        FROM order_details od
        JOIN products p ON p.id = od.product_id
        LEFT JOIN product_translations pt ON pt.product_id = p.id
        LEFT JOIN languages l ON l.id = pt.language_id AND l.code = ?
        GROUP BY p.id
        ORDER BY quantity DESC
        LIMIT 5;
        `;
    try {
      const [rows] = await pool.execute(query, [langCode]);
      return rows as { name: string; quantity: number }[];
    } catch (error) {
      console.error("Error fetching top products from DB:", error);
      throw new Error("Could not fetch top products.");
    }
  }

  static async getTopSellers(): Promise<{ name: string; quantity: number; value: number }[]> {
    const query = `
      SELECT 
        CONCAT(e.first_name, ' ', e.last_name) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN employees e ON o.account_id = e.account_id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      GROUP BY e.id
      ORDER BY quantity DESC
      LIMIT 10;
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows as { name: string; quantity: number; value: number }[];
    } catch (error) {
      console.error("Error fetching top sellers from DB:", error);
      throw new Error("Could not fetch top sellers.");
    }
  }
  
}
