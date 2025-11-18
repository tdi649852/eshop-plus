const path = require('path');
const dotenv = require('dotenv');

const defaultEnvPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: process.env.ENV_PATH || defaultEnvPath });

const parseAllowedOrigins = () => {
  if (!process.env.ALLOWED_ORIGINS) return [];
  return process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'eShop Plus Hyperlocal API',
  port: Number(process.env.PORT) || 4000,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  uploadsDir:
    process.env.FILE_UPLOAD_DIR || path.resolve(process.cwd(), 'storage', 'uploads'),
  allowedOrigins: parseAllowedOrigins(),
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me_super_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'change_me_refresh_secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eshopplus_hyperlocal',
    logging: (process.env.DB_LOGGING || 'false').toLowerCase() === 'true',
  },
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@eshopplus.local',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
    phone: process.env.DEFAULT_ADMIN_PHONE || '9999999999',
  },
  defaultCities: [
    { name: 'Delhi', state: 'Delhi', country: 'India' },
    { name: 'Noida', state: 'Uttar Pradesh', country: 'India' },
    { name: 'Gurugram', state: 'Haryana', country: 'India' },
    { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
    { name: 'Patna', state: 'Bihar', country: 'India' },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
  ],
};

module.exports = env;


