const ApiError = require('../utils/apiError');
const { City } = require('../models');

async function resolveCity(cityIdOrName) {
  if (!cityIdOrName) return null;
  if (!Number.isNaN(Number(cityIdOrName))) {
    return City.findOne({ where: { id: cityIdOrName, isActive: true } });
  }
  return City.findOne({
    where: { name: cityIdOrName.toString(), isActive: true },
  });
}

async function locationMiddleware(req, res, next) {
  try {
    const candidate =
      req.headers['x-city-id'] ||
      req.headers['x-city-name'] ||
      req.query.cityId ||
      req.body.cityId ||
      req.user?.defaultCityId;

    let city = await resolveCity(candidate);

    if (!city) {
      city = await City.findOne({ where: { isActive: true }, order: [['id', 'ASC']] });
    }

    if (!city) {
      throw new ApiError(400, 'City context missing. Please seed cities table.');
    }

    req.context = req.context || {};
    req.context.city = city;
    req.cityId = city.id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = locationMiddleware;


