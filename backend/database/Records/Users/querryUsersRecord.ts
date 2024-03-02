const INSERT:string =
  "INSERT INTO accounts (id, username, password, email) VALUES (?, ?, ?, ?)";

const ACTIVE:string = "UPDATE accounts SET is_active = true WHERE id = ?";

const DELETE:string = "DELETE FROM accounts WHERE id = ?";

const UPDATE_BY_ID:string = "UPDATE accounts SET password = ? WHERE id = ?";

const UPDATE_TOKEN_BY_ID:string = "UPDATE accounts SET refresh_token = ? WHERE id = ?";

const UPDATE_ROLE:string = "UPDATE accounts SET role = ? WHERE username = ?";

const SELECT_ALL:string = "SELECT * FROM accounts";

const SELECT_BY_EMAIL:string = "SELECT * FROM accounts WHERE email = ?";

const SELECT_BY_ID:string = "SELECT username, email, created_at, role FROM accounts WHERE id = ?";

const SELECT_TOKEN_BY_ID:string = "SELECT refresh_token FROM accounts WHERE id = ?";

const SELECT_BY_USERNAME:string =
  "SELECT id, is_active, role, password FROM accounts WHERE username = ?";

export {
  INSERT,
  ACTIVE,
  DELETE,
  UPDATE_BY_ID,
  UPDATE_ROLE,
  SELECT_ALL,
  SELECT_BY_EMAIL,
  SELECT_BY_ID,
  SELECT_BY_USERNAME,
  UPDATE_TOKEN_BY_ID,
  SELECT_TOKEN_BY_ID,
};
