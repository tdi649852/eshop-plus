const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const locationService = require('../services/locationService');

const getCities = catchAsync(async (req, res) => {
  const cities = await locationService.getCities();
  return apiSuccess(res, {
    data: cities,
  });
});

module.exports = {
  getCities,
};


