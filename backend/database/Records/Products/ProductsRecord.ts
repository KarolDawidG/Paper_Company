import { pool } from "../../pool";

interface Products {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

class ProductsRecord {
  constructor(private productsData: Products) {}



static async getById(productId: string, locale: string) {
  const query = `
    SELECT pt.* FROM product_translations pt JOIN languages l ON pt.language_id = l.id
      WHERE pt.product_id = ?
        AND l.code = ?;
`;
  const [results] = await pool.execute(query, [productId, locale]);
  return results;
}

  static async getAll(languageCode: string) {
    try {
      const [results] = await pool.execute(
        `SELECT p.id, COALESCE(pt.name, p.name) AS name, 
          COALESCE(pt.description, p.description) AS description, p.category, p.price, p.stock, p.created_at
          FROM products p
          LEFT JOIN product_translations pt ON p.id = pt.product_id 
          AND pt.language_id = (SELECT id FROM languages WHERE code = ?);`
      , [languageCode]) as any;
      return results.map((obj: any) => new ProductsRecord(obj));
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}

export { ProductsRecord };
