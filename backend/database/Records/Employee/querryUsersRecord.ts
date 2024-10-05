const INSERT: string =
  "INSERT INTO accounts (id, username, password, email) VALUES (?, ?, ?, ?)";

const DELETE: string = "DELETE FROM accounts WHERE id = ?";

const SELECT_ALL: string = "SELECT * FROM accounts";

const SELECT_BY_ID: string =
  "SELECT username, email, created_at, password, role FROM accounts WHERE id = ?";

const UPDATE_USER_DATA_BY_ID: string = "UPDATE accounts SET username = ?, email = ? WHERE id = ?";

export {
  INSERT,
  DELETE,
  SELECT_ALL,
  SELECT_BY_ID,
  UPDATE_USER_DATA_BY_ID,
};