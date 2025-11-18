const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const authService = require('../services/authService');

const registerCustomer = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    defaultCityId: req.body.defaultCityId || req.cityId,
  };
  const user = await authService.registerCustomer(payload);
  return apiSuccess(res, {
    statusCode: 201,
    message: 'Customer registered successfully',
    data: user,
  });
});

const registerRetailer = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    cityId: req.body.cityId || req.cityId,
  };
  const user = await authService.registerRetailer(payload);
  return apiSuccess(res, {
    statusCode: 201,
    message: 'Retailer submitted for approval',
    data: user,
  });
});

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  return apiSuccess(res, {
    message: 'Login successful',
    data,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const data = await authService.refreshTokens(req.body.refreshToken);
  return apiSuccess(res, {
    message: 'Token refreshed',
    data,
  });
});

const profile = catchAsync(async (req, res) => {
  const user = await authService.profile(req.user.id);
  return apiSuccess(res, {
    data: user,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const updated = await authService.updateProfile(req.user.id, req.body);
  return apiSuccess(res, {
    message: 'Profile updated',
    data: updated,
  });
});

module.exports = {
  registerCustomer,
  registerRetailer,
  login,
  refreshToken,
  profile,
  updateProfile,
};


