const SELECT_BY_CLIENT_ID:string = "SELECT * FROM `client_addresses` WHERE client_id = ?";

const DELETE_ADDRESS:string = "DELETE FROM `client_addresses` WHERE id = ?";

const INSERT_ADDRESS:string = "INSERT INTO client_addresses (id, client_id, miasto, ulica, nr_budynku, nr_mieszkania, kod, nazwa_firmy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

export {
  SELECT_BY_CLIENT_ID,
  DELETE_ADDRESS,
  INSERT_ADDRESS
};