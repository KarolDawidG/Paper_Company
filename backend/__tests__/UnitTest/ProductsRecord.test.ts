import { pool } from "../../database/pool";
import { ProductsRecord } from "../../database/Records/Products/ProductsRecord";
import { SELECT_ALL_PRODUCTS, SELECT_BY_ID } from "../../database/Records/Products/querryProductsRecord";

jest.mock("../../database/pool", () => ({
  pool: {
    execute: jest.fn(),
  },
}));

describe("ProductsRecord", () => {

  describe("getById", () => {
    it("should retrieve a product by id and locale", async () => {
      const mockProduct = {
        id: "1",
        name: "Product Name",
        category: "Category",
        description: "Product Description",
        price: 100,
        stock: 10,
        created_at: "2024-01-01T00:00:00Z",
      };
      (pool.execute as jest.Mock).mockResolvedValue([[mockProduct]]);

      const result = await ProductsRecord.getById("1", "en");

      expect(pool.execute).toHaveBeenCalledWith(SELECT_BY_ID,["1", "en"]);
      expect(result).toEqual([mockProduct]);
    });
  });

  describe("getAll", () => {
    it("should retrieve all products with translations based on the language code", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Translated Name",
          category: "Category",
          description: "Translated Description",
          price: 100,
          stock: 10,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Product Name",
          category: "Category 2",
          description: "Product Description",
          price: 200,
          stock: 5,
          created_at: "2024-01-01T00:00:00Z",
        },
      ];
      (pool.execute as jest.Mock).mockResolvedValue([mockProducts]);

      const result = await ProductsRecord.getAll("en");

      expect(pool.execute).toHaveBeenCalledWith(SELECT_ALL_PRODUCTS,["en"]);
      expect(result).toEqual(mockProducts.map((obj) => new ProductsRecord(obj)));
    });

    it("should throw an error if something goes wrong", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(ProductsRecord.getAll("en")).rejects.toThrow("Database error");
    });
  });
});
