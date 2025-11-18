const ApiError = require('../utils/apiError');
const { User } = require('../models');
const { verifyAccessToken } = require('../services/tokenService');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token missing');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await verifyAccessToken(token);
    const user = await User.findByPk(decoded.sub);
    if (!user) {
      throw new ApiError(401, 'User not found for token');
    }
    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to authorize specific roles
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access forbidden. Insufficient permissions.'));
    }

    next();
  };
}

module.exports = authMiddleware;
module.exports.authenticate = authMiddleware;
module.exports.authorizeRoles = authorizeRoles;


