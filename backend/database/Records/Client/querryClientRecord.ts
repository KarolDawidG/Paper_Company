const SELECT_CLIENTS:string = "SELECT * FROM `clients`";

const SELECT_CLIENT_BY_ID:string = "SELECT nazwa_firmy, miasto, kod, ulica, nr_budynku, nr_mieszkania FROM `client_addresses` WHERE id = ?";

const INSERT_CLIENT:string = "INSERT INTO clients (id, first_name, second_name, email) VALUES (?, ?, ?, ?)";

const DELETE_CLIENT:string = "DELETE FROM `clients` WHERE id = ?";

const UPDATE_CLIENT:string = "UPDATE `clients` SET first_name = ?, second_name = ?, email = ? WHERE id = ?";

export {
  SELECT_CLIENTS,
  SELECT_CLIENT_BY_ID,
  INSERT_CLIENT,
  DELETE_CLIENT,
  UPDATE_CLIENT
};