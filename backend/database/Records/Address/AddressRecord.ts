import {performTransaction} from "../performTransaction";
import {v4 as uuidv4} from "uuid";
import {pool} from "../../pool";
import {DELETE_ADDRESS_FROM_ORDERS, DELETE_CLIENT_ADDRESS, INSERT_ADDRESS, SELECT_BY_CLIENT_ID} from "./querryAddressRecord";
import { Address } from "./InterfaceAddress";



class AddressRecord implements Address {
  id: string;
  client_id: string;
  miasto: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
  kod: string;
  nazwa_firmy: string;

  constructor(obj: Address) {
    this.id = obj.id;
    this.client_id = obj.client_id;
    this.miasto = obj.miasto;
    this.ulica = obj.ulica;
    this.nr_budynku = obj.nr_budynku;
    this.nr_mieszkania = obj.nr_mieszkania;
    this.kod = obj.kod;
    this.nazwa_firmy = obj.nazwa_firmy;
  }

  static async insert(formData: Address) {
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(
          INSERT_ADDRESS,
        [
          id,
          formData.client_id,
          formData.miasto,
          formData.ulica,
          formData.nr_budynku,
          formData.nr_mieszkania,
          formData.kod,
          formData.nazwa_firmy
        ]
      );
      return id;
    });
  }

  static async getListById(id:string) {
    try {
      const [results] = await pool.execute(SELECT_BY_CLIENT_ID, [id]) as any;
      return results.map((obj: any) => new AddressRecord(obj));
    } catch (error) {
      console.error("Error in getListById:", error);
      throw error;
    }
  }

  static async delete(id: string) {
    return performTransaction(async (connection) => {
        await connection.execute(DELETE_ADDRESS_FROM_ORDERS, [id]);
        return connection.execute(DELETE_CLIENT_ADDRESS, [id]);
    });
}
}

export { AddressRecord };
