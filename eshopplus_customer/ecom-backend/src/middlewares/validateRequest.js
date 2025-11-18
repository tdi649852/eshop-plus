const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    return next(new ApiError(422, 'Validation failed', formatted));
  }
  return next();
}

module.exports = validateRequest;


