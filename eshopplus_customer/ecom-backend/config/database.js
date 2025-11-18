const mysql = require('mysql2/promise');

const {
  MYSQL_HOST = '127.0.0.1',
  MYSQL_PORT = 3306,
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = '',
  MYSQL_DATABASE = 'eshopplus_mock',
  MYSQL_CONN_LIMIT = 10,
} = process.env;

let pool;

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
}

async function createPool() {
  await ensureDatabaseExists();

  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: Number(MYSQL_CONN_LIMIT) || 10,
    queueLimit: 0,
    namedPlaceholders: true,
  });

  await pool.query(
    `CREATE TABLE IF NOT EXISTS mock_payloads (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      endpoint VARCHAR(120) NOT NULL,
      payload LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_endpoint (endpoint)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
}

async function initDb() {
  if (!pool) {
    await createPool();
  }
  return pool;
}

async function getPool() {
  if (!pool) {
    await initDb();
  }
  return pool;
}

module.exports = {
  initDb,
  getPool,
};

