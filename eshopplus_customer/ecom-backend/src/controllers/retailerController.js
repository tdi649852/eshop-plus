const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const retailerService = require('../services/retailerService');
const { getPaginationParams, buildMeta } = require('../utils/pagination');

const getMyStore = catchAsync(async (req, res) => {
  const retailer = await retailerService.getRetailerProfile(req.user.id);
  return apiSuccess(res, { data: retailer });
});

const listRetailers = catchAsync(async (req, res) => {
  const pagination = getPaginationParams(req);
  const filters = { status: req.query.status };
  const result = await retailerService.listRetailers(req.cityId, filters, pagination);
  return apiSuccess(res, {
    data: result.rows,
    meta: buildMeta({ total: result.count, page: pagination.page, limit: pagination.limit }),
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const retailer = await retailerService.updateRetailerStatus(req.params.id, req.body.status, req.body.notes);
  return apiSuccess(res, { message: 'Retailer status updated', data: retailer });
});

const updateProfile = catchAsync(async (req, res) => {
  const retailer = await retailerService.updateRetailerProfile(req.params.id, req.body);
  return apiSuccess(res, { message: 'Retailer updated', data: retailer });
});

const dashboard = catchAsync(async (req, res) => {
  const retailer = await retailerService.getRetailerProfile(req.user.id);
  const metrics = await retailerService.retailerDashboard(retailer.id);
  return apiSuccess(res, { data: metrics });
});

module.exports = {
  getMyStore,
  listRetailers,
  updateStatus,
  updateProfile,
  dashboard,
};


