const { Cart, CartItem, Product, ProductVariant, ProductImage, Retailer } = require('../models');

async function getOrCreateCart(userId, cityId) {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      cityId,
    },
  });
  if (cityId && cart.cityId !== cityId) {
    cart.cityId = cityId;
    await cart.save();
  }
  return cart;
}

async function getCartWithItems(userId) {
  return Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          { model: Product, as: 'product', include: [{ model: ProductImage, as: 'images', limit: 1 }, { model: Retailer, as: 'retailer' }] },
          { model: ProductVariant, as: 'variant' },
        ],
      },
    ],
  });
}

async function addOrUpdateCartItem(cartId, productId, productVariantId, quantity, priceSnapshot) {
  const [item, created] = await CartItem.findOrCreate({
    where: { cartId, productId, productVariantId },
    defaults: { priceSnapshot, quantity, subtotal: priceSnapshot * quantity },
  });
  if (!created) {
    item.quantity = quantity;
    item.priceSnapshot = priceSnapshot;
    item.subtotal = priceSnapshot * quantity;
    await item.save();
  }
  return item;
}

async function removeCartItem(cartId, itemId) {
  return CartItem.destroy({ where: { cartId, id: itemId } });
}

async function clearCart(cartId) {
  return CartItem.destroy({ where: { cartId } });
}

async function clearCartByUser(userId) {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) return;
  await CartItem.destroy({ where: { cartId: cart.id } });
}

module.exports = {
  getOrCreateCart,
  getCartWithItems,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
  clearCartByUser,
};


