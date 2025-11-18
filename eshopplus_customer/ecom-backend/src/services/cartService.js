const ApiError = require('../utils/apiError');
const cartRepository = require('../repositories/cartRepository');
const { Product, ProductVariant } = require('../models');

async function getCart(userId) {
  const cart = await cartRepository.getCartWithItems(userId);
  return cart || { items: [] };
}

async function addItem(userId, cityId, { productId, productVariantId, quantity }) {
  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }
  const product = await Product.findOne({ where: { id: productId, cityId, isPublished: true } });
  if (!product) {
    throw new ApiError(404, 'Product unavailable in selected city');
  }
  let price = Number(product.salePrice || product.basePrice);
  if (productVariantId) {
    const variant = await ProductVariant.findOne({ where: { id: productVariantId, productId } });
    if (!variant) {
      throw new ApiError(404, 'Variant not found');
    }
    price = Number(variant.salePrice || variant.price);
  }
  const cart = await cartRepository.getOrCreateCart(userId, cityId);
  await cartRepository.addOrUpdateCartItem(cart.id, productId, productVariantId, quantity, price);
  return cartRepository.getCartWithItems(userId);
}

async function removeItem(userId, itemId) {
  const cart = await cartRepository.getCartWithItems(userId);
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }
  await cartRepository.removeCartItem(cart.id, itemId);
  return cartRepository.getCartWithItems(userId);
}

async function clearCart(userId) {
  await cartRepository.clearCartByUser(userId);
}

module.exports = {
  getCart,
  addItem,
  removeItem,
  clearCart,
};


