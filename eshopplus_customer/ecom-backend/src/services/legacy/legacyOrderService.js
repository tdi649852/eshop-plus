const ApiError = require('../../utils/apiError');
const orderService = require('../orderService');
const cartService = require('../cartService');
const { formatOrder, buildMessageKey } = require('./legacyFormatter');
const { toLegacyNumericId } = require('../../utils/legacyId');

async function listOrders(req, res) {
  const orders = await orderService.listOrders(req.user);
  return res.json({
    error: false,
    message: 'Orders retrieved successfully',
    language_message_key: buildMessageKey('Orders retrieved successfully'),
    total: orders.length.toString(),
    data: orders.map(formatOrder),
  });
}

async function placeOrder(req, res) {
  const { address_id: addressId, payment_method: paymentMethod } = req.body;
  if (!addressId) {
    throw new ApiError(400, 'address_id is required');
  }
  const cart = await cartService.getCart(req.user.id);
  if (!cart.items || !cart.items.length) {
    throw new ApiError(400, 'Cart is empty');
  }
  const payload = {
    addressId,
    paymentMethod: paymentMethod || 'cod',
    discount: Number(req.body.discount || 0),
    deliveryFee: Number(req.body.delivery_charge || 0),
    notes: req.body.order_note || '',
    items: cart.items.map((item) => ({
      productId: item.productId,
      productVariantId: item.productVariantId,
      retailerId: item.product?.retailerId,
      quantity: item.quantity,
      price: item.priceSnapshot,
    })),
  };
  const order = await orderService.placeOrder(req.user, req.cityId, payload);
  return res.status(201).json({
    error: false,
    message: 'Order placed successfully',
    language_message_key: buildMessageKey('Order placed successfully'),
    order_id: toLegacyNumericId(order.id),
    final_total: Number(order.total).toFixed(2),
    balance: [{ balance: 0 }],
  });
}

module.exports = {
  listOrders,
  placeOrder,
};


