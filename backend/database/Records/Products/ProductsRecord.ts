import { pool } from "../../pool";
import { performTransaction } from "../performTransaction";
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

  static async getAll2(languageCode: string): Promise<any[]> {
    const query = SELECT_ALL_PRODUCTS;

    try {
      const [rows] = await pool.execute(query, [languageCode]);
      return rows as any[];
    } catch (error) {
      console.error(`Error fetching orders with status ${languageCode}:`, error);
      throw new Error("Could not fetch orders.");
    }
  }


  //nowa metoda do zmniejszania liczby produktu w koszyku, po zakupieniu rzeczy
  static async decreaseQuantitiesForOrder(orderId:string): Promise<void>{
    console.log(orderId);
    const selectQuery = `SELECT product_id, quantity FROM order_details WHERE order_id = ?`;
    const updateQuery = `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`;

    await performTransaction(async(connectiom) => {
      //pobiera produkty z zamowienia
      const[items]:any = await connectiom.execute(selectQuery, [orderId]);

      console.log(items);

        for (const item of items) {
          const {product_id, quantity} = item;

          const [result]:any = await connectiom.execute(updateQuery, [
            quantity,
            product_id,
            quantity
          ]);

          if (result.affectedRows === 0) {
            throw new Error (`Niewystarczajacy stan produktu o ID: ${product_id}`)
          }

        }
    })

  }


}

export { ProductsRecord };
