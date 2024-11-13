const SELECT_CLIENTS:string = "SELECT * FROM `clients`";

const SELECT_CLIENT_BY_ID:string = "SELECT nazwa_firmy, miasto, kod, ulica, nr_budynku, nr_mieszkania FROM `client_addresses` WHERE id = ?";

const INSERT_CLIENT:string = "INSERT INTO clients (id, first_name, second_name, email, company_name) VALUES (?, ?, ?, ?, ?)";

const DELETE_CLIENT:string = "DELETE FROM `clients` WHERE id = ?";

const UPDATE_CLIENT:string = "UPDATE `clients` SET first_name = ?, second_name = ?, email = ? WHERE id = ?";

// todo: c.company_name zamiast a.nazwa_firmy
const CLIENT_ORDER_DATA:string = `SELECT 
    c.id AS client_id,
    c.first_name,
    c.second_name,
    c.email,
    c.created_at AS client_created_at,
    a.id AS address_id,
    a.miasto,
    a.ulica,
    a.nr_budynku,
    a.nr_mieszkania,
    a.kod,
    a.nazwa_firmy,
    a.created_at AS address_created_at
FROM 
    clients c
JOIN 
    client_addresses a ON c.id = a.client_id
WHERE 
    c.id = ? AND a.id = ?;
`;

export {
  SELECT_CLIENTS,
  SELECT_CLIENT_BY_ID,
  INSERT_CLIENT,
  DELETE_CLIENT,
  UPDATE_CLIENT,
  CLIENT_ORDER_DATA
};