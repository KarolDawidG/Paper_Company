import { pool } from "../../pool";
import {SELECT_PRODUCTS} from "./querryProductsRecord";

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
      const [results] = await pool.execute(SELECT_PRODUCTS) as any;
      return results.map((obj: any) => new ProductsRecord(obj));
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}

export { ProductsRecord };
