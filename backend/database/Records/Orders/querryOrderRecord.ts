const INSERT_ORDER:string = "INSERT INTO orders (id, client_id, client_address_id ) VALUES (?, ?, ?)";

const SELECT_ORDERS:string = "SELECT * FROM `orders`";

const SELECT_PENDING_ORDERS:string = `SELECT * FROM orders WHERE status = 'pending';`;

const DELETE_ORDER:string = "DELETE FROM `orders` WHERE id = ?";

export {
  INSERT_ORDER,
  SELECT_ORDERS,
  DELETE_ORDER,
  SELECT_PENDING_ORDERS,
};