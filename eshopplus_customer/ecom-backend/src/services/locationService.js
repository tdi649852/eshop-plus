const cityRepository = require('../repositories/cityRepository');

async function getCities() {
  return cityRepository.listCities();
}

module.exports = {
  getCities,
};


