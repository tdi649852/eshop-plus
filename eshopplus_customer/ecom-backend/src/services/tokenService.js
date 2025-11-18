const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const { RefreshToken, User } = require('../models');
const logger = require('../utils/logger');

function createAccessTokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    defaultCityId: user.defaultCityId,
  };
}

function generateAccessToken(user) {
  return jwt.sign(createAccessTokenPayload(user), env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function getExpiryDate(expiresIn) {
  const match = /^(\d+)([smhdw])$/i.exec(expiresIn);
  if (!match) {
    return dayjs().add(7, 'day').toDate();
  }
  const value = Number(match[1]);
  const unitMap = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    w: 'week',
  };
  const unit = unitMap[match[2].toLowerCase()] || 'day';
  return dayjs().add(value, unit).toDate();
}

async function generateRefreshToken(user, metadata = {}) {
  const expiresAt = getExpiryDate(env.jwt.refreshExpiresIn);
  const token = jwt.sign(
    {
      sub: user.id,
    },
    env.jwt.refreshSecret,
    {
      expiresIn: env.jwt.refreshExpiresIn,
    },
  );

  await RefreshToken.create({
    userId: user.id,
    token,
    userAgent: metadata.userAgent,
    expiresAt,
  });

  return token;
}

async function generateAuthTokens(user, metadata = {}) {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, metadata);
  return {
    accessToken,
    refreshToken,
    expiresIn: env.jwt.expiresIn,
  };
}

async function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}

async function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret);
    const storedToken = await RefreshToken.findOne({
      where: { token, revokedAt: null },
      include: [{ model: User, as: 'user' }],
    });
    if (!storedToken) {
      throw new ApiError(401, 'Refresh token expired or revoked');
    }
    if (dayjs(storedToken.expiresAt).isBefore(dayjs())) {
      throw new ApiError(401, 'Refresh token expired');
    }
    return storedToken;
  } catch (error) {
    logger.warn('Refresh token verification failed: %s', error.message);
    throw new ApiError(401, 'Invalid refresh token');
  }
}

async function revokeRefreshToken(token) {
  await RefreshToken.update(
    { revokedAt: new Date() },
    {
      where: { token },
    },
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateAuthTokens,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
};


