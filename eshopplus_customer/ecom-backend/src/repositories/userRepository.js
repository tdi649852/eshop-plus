const { User, Address, City } = require('../models');

async function createUser(data, options = {}) {
  return User.create(data, options);
}

async function findByEmail(email, options = {}) {
  return User.scope('withPassword').findOne({
    where: { email },
    ...options,
  });
}

async function findByPhone(phone) {
  return User.scope('withPassword').findOne({
    where: { phone },
  });
}

async function findById(id, options = {}) {
  return User.findByPk(id, {
    include: [
      { model: Address, as: 'addresses', include: [{ model: City, as: 'city' }] },
      { model: City, as: 'defaultCity' },
    ],
    ...options,
  });
}

async function updateUser(id, payload) {
  await User.update(payload, { where: { id } });
  return findById(id);
}

module.exports = {
  createUser,
  findByEmail,
  findByPhone,
  findById,
  updateUser,
};


