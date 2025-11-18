const { Retailer, User, City, Area, Order } = require('../models');

async function createRetailer(payload, options = {}) {
  return Retailer.create(payload, options);
}

async function findRetailerByUser(userId) {
  return Retailer.findOne({
    where: { userId },
    include: [
      { model: User, as: 'owner' },
      { model: City, as: 'city' },
      { model: Area, as: 'area' },
    ],
  });
}

async function findRetailerById(id) {
  return Retailer.findByPk(id, {
    include: [
      { model: User, as: 'owner' },
      { model: City, as: 'city' },
      { model: Area, as: 'area' },
    ],
  });
}

async function listRetailersByCity(cityId, filters = {}, pagination = {}) {
  return Retailer.findAndCountAll({
    where: {
      cityId,
      status: filters.status || 'approved',
    },
    include: [{ model: City, as: 'city' }],
    limit: pagination.limit,
    offset: pagination.offset,
    order: pagination.sort || [['createdAt', 'DESC']],
  });
}

async function updateRetailer(id, payload) {
  await Retailer.update(payload, { where: { id } });
  return findRetailerById(id);
}

async function getRetailerDashboardMetrics(retailerId) {
  const ordersCount = await Order.count({ where: { retailerId } });
  return {
    ordersCount,
  };
}

module.exports = {
  createRetailer,
  findRetailerByUser,
  findRetailerById,
  listRetailersByCity,
  updateRetailer,
  getRetailerDashboardMetrics,
};


