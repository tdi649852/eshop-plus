function apiSuccess(res, { message = 'Success', data = null, meta = null, statusCode = 200 }) {
  return res.status(statusCode).json({
    error: false,
    message,
    data,
    meta,
  });
}

function apiError(res, { message = 'Something went wrong', errors = [], statusCode = 500, code }) {
  return res.status(statusCode).json({
    error: true,
    message,
    errors,
    code,
  });
}

module.exports = {
  apiSuccess,
  apiError,
};


