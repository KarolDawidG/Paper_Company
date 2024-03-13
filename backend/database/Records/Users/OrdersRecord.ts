import { performTransaction } from "../performTransaction";
import { v4 as uuidv4 } from "uuid";

interface Order {
  id: string;
  imie: string;
  email: string;
  produkt: string;
  ilosc: number;
  miasto: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
  kod: string;
  nazwa_firmy: string;
  sales_id: string;
}

class OrdersRecord {
  constructor(private orderData: Order) {}

  static async insert(formData: Order) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(
        "INSERT INTO orders (id, imie, email, produkt, ilosc, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy, sales_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          formData.imie,
          formData.email,
          formData.produkt,
          formData.ilosc,
          formData.miasto,
          formData.ulica,
          formData.nr_budynku,
          formData.nr_mieszkania,
          formData.kod,
          formData.nazwa_firmy,
          formData.sales_id
        ]
      );
      return id;
    });
  }
}

export { OrdersRecord };
