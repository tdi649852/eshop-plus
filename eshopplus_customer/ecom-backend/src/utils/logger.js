const { createLogger, format, transports } = require('winston');
const env = require('../config/env');

const logger = createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: env.appName },
  transports: [
    new transports.Console({
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, stack }) =>
          stack ? `${timestamp} [${level}]: ${message}\n${stack}` : `${timestamp} [${level}]: ${message}`,
        ),
      ),
    }),
  ],
});

module.exports = logger;


