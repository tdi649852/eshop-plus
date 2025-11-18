const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const orderService = require('../services/orderService');

const placeOrder = catchAsync(async (req, res) => {
  const order = await orderService.placeOrder(req.user, req.cityId, req.body);
  return apiSuccess(res, { statusCode: 201, message: 'Order placed', data: order });
});

const listOrders = catchAsync(async (req, res) => {
  const orders = await orderService.listOrders(req.user);
  return apiSuccess(res, { data: orders });
});

const updateStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.user, req.params.id, req.body.status);
  return apiSuccess(res, { message: 'Order status updated', data: order });
});

module.exports = {
  placeOrder,
  listOrders,
  updateStatus,
};


