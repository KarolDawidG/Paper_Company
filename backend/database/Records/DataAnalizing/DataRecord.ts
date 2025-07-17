
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
}
