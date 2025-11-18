const ApiError = require('../utils/apiError');
const retailerRepository = require('../repositories/retailerRepository');
const { RETAILER_STATUS } = require('../utils/constants');

async function getRetailerProfile(userId) {
  const retailer = await retailerRepository.findRetailerByUser(userId);
  if (!retailer) {
    throw new ApiError(404, 'Retailer profile not found');
  }
  return retailer;
}

async function listRetailers(cityId, filters, pagination) {
  const result = await retailerRepository.listRetailersByCity(cityId, filters, pagination);
  return result;
}

async function updateRetailerStatus(retailerId, status, notes) {
  if (!Object.values(RETAILER_STATUS).includes(status)) {
    throw new ApiError(422, 'Invalid status');
  }
  return retailerRepository.updateRetailer(retailerId, { status, verificationNotes: notes });
}

async function updateRetailerProfile(retailerId, payload) {
  const retailer = await retailerRepository.findRetailerById(retailerId);
  if (!retailer) {
    throw new ApiError(404, 'Retailer not found');
  }
  return retailerRepository.updateRetailer(retailerId, payload);
}

async function retailerDashboard(retailerId) {
  return retailerRepository.getRetailerDashboardMetrics(retailerId);
}

module.exports = {
  getRetailerProfile,
  listRetailers,
  updateRetailerStatus,
  updateRetailerProfile,
  retailerDashboard,
};


