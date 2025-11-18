const { Address, City, Area } = require('../models');

async function listUserAddresses(userId) {
  return Address.findAll({
    where: { userId },
    include: [
      { model: City, as: 'city' },
      { model: Area, as: 'area' },
    ],
  });
}

async function createAddress(payload) {
  return Address.create(payload);
}

async function updateAddress(id, payload) {
  await Address.update(payload, { where: { id } });
  return Address.findByPk(id, {
    include: [
      { model: City, as: 'city' },
      { model: Area, as: 'area' },
    ],
  });
}

async function deleteAddress(id, userId) {
  return Address.destroy({ where: { id, userId } });
}

module.exports = {
  listUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};


