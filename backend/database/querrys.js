const insertRoot = `INSERT INTO accounts (id, username, password, email, role, is_active) VALUES (UUID(), 'root', '$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K', 'root@gmail.com', 'admin', '1');`;

const findRoot = `SELECT id FROM accounts WHERE username = 'root'`;

const createAccounts = `
    CREATE TABLE IF NOT EXISTS accounts (
      id varchar(36) NOT NULL,
      username varchar(50) NOT NULL,
      password varchar(255) NOT NULL,
      email varchar(100) NOT NULL,
      role varchar(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      is_active BOOLEAN DEFAULT false,
      refresh_token TEXT,
      UNIQUE KEY (username),
      UNIQUE KEY (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const deleteNotActiveAccount = `
    CREATE EVENT IF NOT EXISTS delete_inactive_users
      ON SCHEDULE EVERY 15 MINUTE
      DO
      BEGIN
        DELETE FROM accounts WHERE is_active = false AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 15;
      END;
`;

const event_schedulerON = `SET GLOBAL event_scheduler = ON;
`;

module.exports = {
  insertRoot,
  findRoot,
  createAccounts,
  deleteNotActiveAccount,
  event_schedulerON,
};
