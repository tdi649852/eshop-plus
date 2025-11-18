const { City, Area } = require('../models');

async function listCities() {
  return City.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']],
    include: [{ model: Area, as: 'areas' }],
  });
}

async function findCityById(id) {
  return City.findByPk(id);
}

async function findAreaById(id) {
  return Area.findByPk(id);
}

async function createArea(payload) {
  return Area.create(payload);
}

module.exports = {
  listCities,
  findCityById,
  findAreaById,
  createArea,
};


