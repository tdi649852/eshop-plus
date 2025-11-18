const seedDefaultCities = require('./seedDefaultCities');
const seedDefaultAdmin = require('./seedDefaultAdmin');
const seedSampleData = require('./seedSampleData');

async function bootstrap() {
  await seedDefaultCities();
  await seedDefaultAdmin();
  await seedSampleData();
}

module.exports = bootstrap;

