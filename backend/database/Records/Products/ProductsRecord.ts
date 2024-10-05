import { pool } from "../../pool";
import { Products } from "./InterfaceProducts";
import { SELECT_ALL_PRODUCTS, SELECT_BY_ID } from "./querryProductsRecord";

class ProductsRecord {
  constructor(private productsData: Products) {}

static async getById(productId: string, locale: string) {

  const [results] = await pool.execute(SELECT_BY_ID, [productId, locale]);
  return results;
}

  static async getAll(languageCode: string) {
    try {
      const [results] = await pool.execute(
        SELECT_ALL_PRODUCTS
      , [languageCode]) as any;
      return results.map((obj: any) => new ProductsRecord(obj));
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}

export { ProductsRecord };
