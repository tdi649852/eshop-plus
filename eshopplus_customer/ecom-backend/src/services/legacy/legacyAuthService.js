const dayjs = require('dayjs');
const ApiError = require('../../utils/apiError');
const { buildMessageKey, formatUser } = require('./legacyFormatter');
const userRepository = require('../../repositories/userRepository');
const { findByPhone } = require('../../repositories/userRepository');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateAuthTokens } = require('../tokenService');
const { USER_ROLES } = require('../../utils/constants');
const { City } = require('../../models');

async function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  const normalized = identifier.toString().trim().toLowerCase();
  const userByEmail = await userRepository.findByEmail(normalized);
  if (userByEmail) return userByEmail;
  const options = { where: { phone: normalized } };
  return userRepository.findByEmail(normalized, options);
}

async function resolveUserByEmailOrPhone(email, mobile) {
  if (email) {
    const user = await userRepository.findByEmail(email.toString().trim().toLowerCase());
    if (user) return user;
  }
  if (mobile) {
    const normalized = mobile.toString().trim();
    return userRepository.findByPhone(normalized);
  }
  return null;
}

async function handleVerifyUser(req, res) {
  const { email, mobile } = req.body;
  if (!email && !mobile) {
    throw new ApiError(400, 'Email or mobile is required');
  }
  const user =
    (await resolveUserByEmailOrPhone(email, mobile)) ||
    (await resolveUserByEmailOrPhone(mobile, email));
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const tokens = await generateAuthTokens(user, { userAgent: req.headers['user-agent'] });
  return res.json({
    error: false,
    message: 'User verified successfully',
    language_message_key: buildMessageKey('User verified successfully'),
    token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    user: formatUser(user),
  });
}

async function handleLogin(req, res) {
  const { email, mobile, password } = req.body;
  if (!password) {
    throw new ApiError(400, 'Password is required');
  }
  const identifier = email || mobile;
  if (!identifier) {
    throw new ApiError(400, 'Email or mobile is required');
  }
  const user =
    (await resolveUserByEmailOrPhone(email, mobile)) ||
    (await resolveUserByEmailOrPhone(mobile, email));
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }
  user.lastLoginAt = new Date();
  await user.save();
  const tokens = await generateAuthTokens(user, { userAgent: req.headers['user-agent'] });
  return res.json({
    error: false,
    message: 'Login successful',
    language_message_key: buildMessageKey('Login successful'),
    token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    user: formatUser(user),
  });
}

async function handleRegister(req, res) {
  const {
    name,
    first_name: firstNameBody,
    last_name: lastNameBody,
    email,
    mobile,
    password,
    city_id: cityIdBody,
  } = req.body;

  if (!email && !mobile) {
    throw new ApiError(400, 'Email or mobile is required');
  }
  if (!password) {
    throw new ApiError(400, 'Password is required');
  }
  const existing = await resolveUserByEmailOrPhone(email, mobile);
  if (existing) {
    throw new ApiError(409, 'User already exists');
  }
  const fullName = name || `${firstNameBody || ''} ${lastNameBody || ''}`.trim();
  const [firstName, ...rest] = fullName.trim().split(' ');
  const lastName = rest.join(' ');

  const hashedPassword = await hashPassword(password);
  const defaultCity =
    cityIdBody || (await City.findOne({ where: { name: 'Delhi' } }))?.id || null;

  const user = await userRepository.createUser({
    firstName: firstName || 'Customer',
    lastName: lastName || '',
    email: email?.toLowerCase(),
    phone: mobile,
    password: hashedPassword,
    role: USER_ROLES.CUSTOMER,
    defaultCityId: defaultCity,
    isEmailVerified: !!email,
  });
  const tokens = await generateAuthTokens(user, { userAgent: req.headers['user-agent'] });
  return res.status(201).json({
    error: false,
    message: 'User registered successfully',
    language_message_key: buildMessageKey('User registered successfully'),
    token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    user: formatUser(user),
  });
}

module.exports = {
  handleVerifyUser,
  handleLogin,
  handleRegister,
};


