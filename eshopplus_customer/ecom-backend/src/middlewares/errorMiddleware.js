const ApiError = require('../utils/apiError');
const { apiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const error = err instanceof ApiError ? err : new ApiError(err.statusCode || 500, err.message || 'Internal server error');
  if (error.statusCode >= 500) {
    logger.error('Internal error: %s', error.stack || error.message);
  } else {
    logger.warn('API error: %s', error.message);
  }
  return apiError(res, {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
  });
}

module.exports = errorHandler;


