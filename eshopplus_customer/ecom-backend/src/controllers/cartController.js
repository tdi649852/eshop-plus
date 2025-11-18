const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const cartService = require('../services/cartService');

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return apiSuccess(res, { data: cart });
});

const addItem = catchAsync(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.cityId, req.body);
  return apiSuccess(res, { message: 'Cart updated', data: cart });
});

const removeItem = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  return apiSuccess(res, { message: 'Item removed', data: cart });
});

const clearCart = catchAsync(async (req, res) => {
  await cartService.clearCart(req.user.id);
  return apiSuccess(res, { message: 'Cart cleared' });
});

module.exports = {
  getCart,
  addItem,
  removeItem,
  clearCart,
};


