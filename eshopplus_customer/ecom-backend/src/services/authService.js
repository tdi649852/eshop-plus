const ApiError = require('../utils/apiError');
const { USER_ROLES, RETAILER_STATUS } = require('../utils/constants');
const { hashPassword, comparePassword } = require('../utils/password');
const userRepository = require('../repositories/userRepository');
const retailerRepository = require('../repositories/retailerRepository');
const { generateAuthTokens, verifyRefreshToken, revokeRefreshToken } = require('./tokenService');
const { City } = require('../models');
const slugify = require('../utils/slugify');

async function ensureCity(cityId) {
  const city = await City.findByPk(cityId);
  if (!city) {
    throw new ApiError(404, 'Selected city does not exist');
  }
  return city;
}

async function registerCustomer(payload) {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }
  await ensureCity(payload.defaultCityId);
  const password = await hashPassword(payload.password);
  const user = await userRepository.createUser({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    password,
    role: USER_ROLES.CUSTOMER,
    defaultCityId: payload.defaultCityId,
  });
  return user;
}

async function registerRetailer(payload) {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  await ensureCity(payload.cityId);
  const password = await hashPassword(payload.password);
  const user = await userRepository.createUser({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    password,
    role: USER_ROLES.RETAILER,
    defaultCityId: payload.cityId,
  });

  await retailerRepository.createRetailer({
    userId: user.id,
    storeName: payload.storeName,
    slug: `${slugify(payload.storeName)}-${Date.now()}`,
    phone: payload.storePhone || payload.phone,
    gstNumber: payload.gstNumber,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    pincode: payload.pincode,
    cityId: payload.cityId,
    areaId: payload.areaId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    status: RETAILER_STATUS.PENDING,
    description: payload.description,
  });

  return userRepository.findById(user.id);
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const tokens = await generateAuthTokens(user, {});
  const profile = await userRepository.findById(user.id);
  return {
    user: profile,
    tokens,
  };
}

async function profile(userId) {
  return userRepository.findById(userId);
}

async function updateProfile(userId, payload) {
  if (payload.defaultCityId) {
    await ensureCity(payload.defaultCityId);
  }
  return userRepository.updateUser(userId, payload);
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token required');
  }
  const stored = await verifyRefreshToken(refreshToken);
  await revokeRefreshToken(refreshToken);
  const tokens = await generateAuthTokens(stored.user, {});
  const profile = await userRepository.findById(stored.user.id);
  return {
    user: profile,
    tokens,
  };
}

module.exports = {
  registerCustomer,
  registerRetailer,
  login,
  profile,
  updateProfile,
  refreshTokens,
};


