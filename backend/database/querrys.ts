const insertRoot: string = `INSERT INTO accounts (id, username, password, email, role, is_active) VALUES (UUID(), 'root', '$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K', 'root@gmail.com', 'admin', '1');`;

const findRoot: string = `SELECT id FROM accounts WHERE username = 'root'`;

const createAccounts: string = `
    CREATE TABLE IF NOT EXISTS accounts (
      id varchar(36) NOT NULL,
      username varchar(50) NOT NULL,
      password varchar(255) NOT NULL,
      email varchar(100) NOT NULL,
      role varchar(20) NOT NULL DEFAULT 'user',
      img_url varchar(100) NOT NULL DEFAULT 'https://utfs.io/f/0576a965-e83c-47aa-b5b1-31aeac3c55c0-kmjf4x.jpg',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      is_active BOOLEAN DEFAULT false,
      refresh_token TEXT,
      UNIQUE KEY (username),
      UNIQUE KEY (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createEmployee: string = `
    CREATE TABLE IF NOT EXISTS employees (
      id VARCHAR(36) PRIMARY KEY,
      first_name VARCHAR(50),
      last_name VARCHAR(255),
      email VARCHAR(100) UNIQUE,
      phone_number VARCHAR(20),
      department VARCHAR(100),
      position VARCHAR(100),
      hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      account_id VARCHAR(36),  -- FK referencing accounts(id)
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createClients: string = `
    CREATE TABLE IF NOT EXISTS clients (
      id varchar(36) NOT NULL,
      first_name varchar(50) NOT NULL,
      second_name varchar(255) NOT NULL,
      email varchar(100) NOT NULL,
      company_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createClientAddresses: string = `
    CREATE TABLE IF NOT EXISTS client_addresses (
      id varchar(36) NOT NULL,
      client_id varchar(36) NOT NULL,
      miasto varchar(100) NOT NULL,
      ulica varchar(100) NOT NULL,
      nr_budynku varchar(20) NOT NULL,
      nr_mieszkania varchar(20),
      kod varchar(20) NOT NULL,
      nazwa_firmy varchar(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createOrders: string = `
    CREATE TABLE IF NOT EXISTS orders (
      id varchar(36) NOT NULL,
      client_id varchar(36) NOT NULL,
      client_address_id varchar(36) NOT NULL,
      status ENUM('pending', 'shipped', 'delivered') NOT NULL DEFAULT 'pending', -- dodano 'delivered' do statusu
      payment_status ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid', -- status płatności
      payment_date TIMESTAMP NULL, -- data płatności, null dopóki zamówienie nie jest opłacone
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (client_address_id) REFERENCES client_addresses(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createOrderDetails: string = `
    CREATE TABLE IF NOT EXISTS order_details (
      id varchar(36) NOT NULL,
      order_id varchar(36) NOT NULL,
      product_id varchar(36) NOT NULL,
      quantity int NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const createProducts: string = `
    CREATE TABLE IF NOT EXISTS products (
      id varchar(36) NOT NULL,
      name varchar(255) NOT NULL,
      category varchar(50) NOT NULL,
      description text,
      price decimal(10, 2) NOT NULL,
      stock int NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

    const createLanguage: string = `
    CREATE TABLE IF NOT EXISTS languages (
      id varchar(36) NOT NULL,
      code varchar(10) NOT NULL,
      name varchar(50) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY (code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

    const createproductTranslations: string = `
    CREATE TABLE IF NOT EXISTS product_translations (
      product_id varchar(36) NOT NULL,
      language_id varchar(36) NOT NULL,
      name varchar(255) NOT NULL,
      description text,
      PRIMARY KEY (product_id, language_id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (language_id) REFERENCES languages(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

const deleteNotActiveAccount: string = `
    CREATE EVENT IF NOT EXISTS delete_inactive_users
      ON SCHEDULE EVERY 15 MINUTE
      DO
      BEGIN
        DELETE FROM accounts WHERE is_active = false AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 15;
      END;
`;

const event_schedulerON: string = `SET GLOBAL event_scheduler = ON;
`;


export {
  insertRoot,
  findRoot,
  createAccounts,
  createEmployee,
  createClientAddresses,
  createOrderDetails,
  deleteNotActiveAccount,
  event_schedulerON,
  createOrders,
  createProducts,
  createClients,
  createLanguage,
  createproductTranslations,
};
