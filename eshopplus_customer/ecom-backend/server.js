const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');
const ensureDatabaseExists = require('./src/utils/ensureDatabase');
const { sequelize } = require('./src/models');
const bootstrap = require('./src/loaders');

async function start() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync();
    await bootstrap();

    app.listen(env.port, () => {
      logger.info('%s listening on port %d', env.appName, env.port);
    });
  } catch (error) {
    logger.error('Failed to bootstrap application: %s', error.stack || error.message);
    process.exit(1);
  }
}

start();


