const bcrypt = require('bcryptjs');
const env = require('../config/env');

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
  return bcrypt.hash(plainPassword, salt);
}

async function comparePassword(plainPassword, hash) {
  if (!plainPassword || !hash) return false;
  return bcrypt.compare(plainPassword, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};


