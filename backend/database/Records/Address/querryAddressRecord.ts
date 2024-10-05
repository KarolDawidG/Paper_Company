const SELECT_BY_CLIENT_ID:string = "SELECT * FROM `client_addresses` WHERE client_id = ?";

const DELETE_CLIENT_ADDRESS:string = "DELETE FROM `client_addresses` WHERE id = ?";

const DELETE_ADDRESS_FROM_ORDERS:string = "DELETE FROM `orders` WHERE client_address_id = ?"

const INSERT_ADDRESS:string = "INSERT INTO client_addresses (id, client_id, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

export {
  SELECT_BY_CLIENT_ID,
  INSERT_ADDRESS,
  DELETE_CLIENT_ADDRESS,
  DELETE_ADDRESS_FROM_ORDERS
};