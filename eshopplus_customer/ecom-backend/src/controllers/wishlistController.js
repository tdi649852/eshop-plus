const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const wishlistService = require('../services/wishlistService');

const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  return apiSuccess(res, { data: wishlist });
});

const addToWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.addToWishlist(req.user.id, req.body.productId, req.cityId);
  return apiSuccess(res, { message: 'Added to wishlist', data: wishlist });
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
  return apiSuccess(res, { message: 'Removed from wishlist', data: wishlist });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};


