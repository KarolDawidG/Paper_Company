const INSERT =
  "INSERT INTO accounts (id, username, password, email) VALUES (?, ?, ?, ?)";

const ACTIVE = "UPDATE accounts SET is_active = true WHERE id = ?";

const DELETE = "DELETE FROM accounts WHERE id = ?";

const UPDATE_BY_ID = "UPDATE accounts SET password = ? WHERE id = ?";

const UPDATE_TOKEN_BY_ID = "UPDATE accounts SET refresh_token = ? WHERE id = ?";

const UPDATE_ROLE = "UPDATE accounts SET role = ? WHERE username = ?";

const SELECT_ALL = "SELECT * FROM accounts";

const SELECT_BY_EMAIL = "SELECT * FROM accounts WHERE email = ?";

const SELECT_BY_ID = "SELECT * FROM accounts WHERE id = ?";

const SELECT_BY_USERNAME =
  "SELECT id, is_active, role, password FROM accounts WHERE username = ?";

module.exports = {
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
};
