const { City } = require('../models');
const env = require('../config/env');
const logger = require('../utils/logger');

async function seedDefaultCities() {
  for (const city of env.defaultCities) {
    // eslint-disable-next-line no-await-in-loop
    const [record, created] = await City.findOrCreate({
      where: { name: city.name },
      defaults: {
        state: city.state,
        country: city.country,
        isActive: true,
      },
    });
    if (created) {
      logger.info('Seeded city %s', record.name);
    }
  }
}

module.exports = seedDefaultCities;


