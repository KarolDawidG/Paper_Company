import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";
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

  static async getAll() {
    try {
      const [results] = await pool.execute("SELECT * FROM `products`") as any;
      return results.map((obj: any) => new ProductsRecord(obj));
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}

export { ProductsRecord };
