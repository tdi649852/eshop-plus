const mysql = require('mysql2/promise');
const env = require('../config/env');
const logger = require('./logger');

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.username,
    password: env.db.password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
  logger.info('Verified database "%s" is ready', env.db.database);
}

module.exports = ensureDatabaseExists;


