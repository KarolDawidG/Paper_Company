
import { pool } from "../../pool";

interface MonthlyData {
  profit: number;
  clients: { name: string; quantity: number; value: number }[];
  sellers: { name: string; quantity: number; value: number }[];
  products: { name: string; quantity: number }[];
  predictions: { month: string; profit: number }[];
}


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

    static async getTopClients(): Promise<{ name: string; quantity: number; value: number }[]> {
    const query = `
      SELECT 
        COALESCE(c.company_name, CONCAT(c.first_name, ' ', c.second_name)) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      GROUP BY c.id
      ORDER BY value DESC
      LIMIT 10;
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows as { name: string; quantity: number; value: number }[];
    } catch (error) {
      console.error("Error fetching top clients from DB:", error);
      throw new Error("Could not fetch top clients.");
    }
  }

  static async getMonthlyProfit(): Promise<{ month: string; profit: number }[]> {
  const query = `
    SELECT 
      DATE_FORMAT(o.created_at, '%Y-%m') AS month,
      SUM(od.quantity * p.price) AS profit
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON p.id = od.product_id
    GROUP BY month
    ORDER BY month ASC;
  `;

  try {
    const [rows] = await pool.execute(query);
    return rows as { month: string; profit: number }[];
  } catch (error) {
    console.error("Error fetching monthly profit from DB:", error);
    throw new Error("Could not fetch monthly profit.");
  }
}

static async getMonthlySummaryData(month: string, langCode: string = 'pl') {
  const connection = await pool.getConnection();
  try {
    const likeMonth = `${month}%`;

    // Top clients
    const [clients] = await connection.execute(
      `
      SELECT 
        COALESCE(c.company_name, CONCAT(c.first_name, ' ', c.second_name)) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY c.id
      ORDER BY value DESC
      LIMIT 5;
      `,
      [month]
    );

    // Top sellers
    const [sellers] = await connection.execute(
      `
      SELECT 
        CONCAT(e.first_name, ' ', e.last_name) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN employees e ON o.account_id = e.account_id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY e.id
      ORDER BY quantity DESC
      LIMIT 5;
      `,
      [month]
    );

    // Top products
    const [products] = await connection.execute(
      `
      SELECT MAX(COALESCE(pt.name, p.name)) AS name, SUM(od.quantity) AS quantity
      FROM order_details od
      JOIN products p ON p.id = od.product_id
      LEFT JOIN product_translations pt ON pt.product_id = p.id
      LEFT JOIN languages l ON l.id = pt.language_id AND l.code = ?
      JOIN orders o ON od.order_id = o.id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY p.id
      ORDER BY quantity DESC
      LIMIT 5;
      `,
      [langCode, month]
    );

    // Monthly profit
    const [profit] = await connection.execute(
      `
      SELECT SUM(od.quantity * p.price) AS profit
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?;
      `,
      [month]
    );

    return {
      clients,
      sellers,
      products,
      profit: (profit as any)[0]?.profit ?? 0,
    };
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    throw new Error('Could not fetch monthly summary data.');
  } finally {
    connection.release();
  }
}


static async getMonthlyReport(month: string): Promise<MonthlyData> {
  const [clients, sellers, products, predictions] = await Promise.all([
    pool.execute(
      `
      SELECT 
        COALESCE(c.company_name, CONCAT(c.first_name, ' ', c.second_name)) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY c.id
      ORDER BY value DESC
      LIMIT 10
      `,
      [month]
    ),

    pool.execute(
      `
      SELECT 
        CONCAT(e.first_name, ' ', e.last_name) AS name,
        SUM(od.quantity) AS quantity,
        SUM(od.quantity * p.price) AS value
      FROM orders o
      JOIN employees e ON o.account_id = e.account_id
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY e.id
      ORDER BY quantity DESC
      LIMIT 10
      `,
      [month]
    ),

    pool.execute(
      `
      SELECT MAX(COALESCE(pt.name, p.name)) AS name, SUM(od.quantity) AS quantity
      FROM order_details od
      JOIN products p ON p.id = od.product_id
      LEFT JOIN product_translations pt ON pt.product_id = p.id
      LEFT JOIN languages l ON l.id = pt.language_id AND l.code = 'pl'
      JOIN orders o ON o.id = od.order_id
      WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      GROUP BY p.id
      ORDER BY quantity DESC
      LIMIT 5
      `,
      [month]
    ),

    pool.execute(
      `
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') AS month,
        SUM(od.quantity * p.price) AS profit
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON p.id = od.product_id
      GROUP BY month
      ORDER BY month ASC
      `
    )
  ]);

  const profit = (clients[0] as any[]).reduce((sum, c) => sum + c.value, 0);

  return {
    profit,
    clients: clients[0] as MonthlyData['clients'],
    sellers: sellers[0] as MonthlyData['sellers'],
    products: products[0] as MonthlyData['products'],
    predictions: predictions[0] as MonthlyData['predictions'],
  };
}


}
