const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const addressService = require('../services/addressService');

const listAddresses = catchAsync(async (req, res) => {
  const addresses = await addressService.listAddresses(req.user.id);
  return apiSuccess(res, { data: addresses });
});

const createAddress = catchAsync(async (req, res) => {
  const address = await addressService.createAddress(req.user.id, req.body);
  return apiSuccess(res, { statusCode: 201, message: 'Address saved', data: address });
});

const updateAddress = catchAsync(async (req, res) => {
  const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
  return apiSuccess(res, { message: 'Address updated', data: address });
});

const deleteAddress = catchAsync(async (req, res) => {
  await addressService.deleteAddress(req.user.id, req.params.id);
  return apiSuccess(res, { message: 'Address removed' });
});

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};


