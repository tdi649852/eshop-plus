const ApiError = require('../../utils/apiError');
const cartService = require('../cartService');
const { summarizeCart, buildMessageKey } = require('./legacyFormatter');

async function getCart(req, res) {
  const cart = await cartService.getCart(req.user.id);
  const payload = summarizeCart(cart);
  return res.json({
    error: false,
    message: 'Cart retrieved successfully',
    language_message_key: buildMessageKey('Cart retrieved successfully'),
    ...payload,
    data: payload,
  });
}

async function manageCart(req, res) {
  const { product_id: productId, product_variant_id: variantId, qty, is_saved_for_later: saveForLater } =
    req.body;
  if (!productId) {
    throw new ApiError(400, 'product_id is required');
  }
  const quantity = Number(qty || 1);
  if (quantity <= 0) {
    throw new ApiError(400, 'Quantity must be greater than zero');
  }
  const cart = await cartService.addItem(req.user.id, req.cityId, {
    productId,
    productVariantId: variantId,
    quantity,
  });
  const payload = summarizeCart(cart);
  if (saveForLater) {
    payload.cart.forEach((item) => {
      item.is_saved_for_later = Number(saveForLater);
    });
  }
  return res.json({
    error: false,
    message: 'Cart updated successfully',
    language_message_key: buildMessageKey('Cart updated successfully'),
    ...payload,
    data: payload,
  });
}

async function removeCartItem(req, res) {
  const { cart_id: cartItemId, id } = req.body;
  const targetId = cartItemId || id;
  if (!targetId) {
    throw new ApiError(400, 'cart_id is required');
  }
  const cart = await cartService.removeItem(req.user.id, targetId);
  const payload = summarizeCart(cart);
  return res.json({
    error: false,
    message: 'Item removed from cart',
    language_message_key: buildMessageKey('Item removed from cart'),
    ...payload,
    data: payload,
  });
}

async function clearCart(req, res) {
  await cartService.clearCart(req.user.id);
  return res.json({
    error: false,
    message: 'Cart cleared successfully',
    language_message_key: buildMessageKey('Cart cleared successfully'),
  });
}

module.exports = {
  getCart,
  manageCart,
  removeCartItem,
  clearCart,
};


