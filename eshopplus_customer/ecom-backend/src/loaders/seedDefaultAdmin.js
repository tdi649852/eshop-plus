const { User, City } = require('../models');
const env = require('../config/env');
const { hashPassword } = require('../utils/password');
const { USER_ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

async function seedDefaultAdmin() {
  const adminExists = await User.findOne({ where: { email: env.defaultAdmin.email } });
  if (adminExists) {
    return;
  }

  const defaultCity = await City.findOne({ where: { name: 'Delhi' } });

  const password = await hashPassword(env.defaultAdmin.password);
  await User.create({
    firstName: 'Super',
    lastName: 'Admin',
    email: env.defaultAdmin.email,
    phone: env.defaultAdmin.phone,
    password,
    role: USER_ROLES.ADMIN,
    defaultCityId: defaultCity?.id,
    isEmailVerified: true,
  });
  logger.info('Default admin user created with email %s', env.defaultAdmin.email);
}

module.exports = seedDefaultAdmin;


