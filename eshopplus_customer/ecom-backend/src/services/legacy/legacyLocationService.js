const cityRepository = require('../../repositories/cityRepository');
const { buildMessageKey } = require('./legacyFormatter');

async function listCities(req, res) {
  const cities = await cityRepository.listCities();
  return res.json({
    error: false,
    message: 'Cities retrieved successfully',
    language_message_key: buildMessageKey('Cities retrieved successfully'),
    total: cities.length,
    data: cities.map((city) => ({
      id: city.id,
      name: city.name,
      minimum_free_delivery_order_amount: 0,
      delivery_charges: 0,
    })),
  });
}

module.exports = {
  listCities,
};

