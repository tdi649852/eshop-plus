const { WishlistItem, Product, ProductImage, Retailer } = require('../models');

async function listWishlist(userId) {
  return WishlistItem.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: 'product',
        include: [
          { model: ProductImage, as: 'images', limit: 1 },
          { model: Retailer, as: 'retailer' },
        ],
      },
    ],
  });
}

async function addToWishlist(userId, productId, cityId) {
  return WishlistItem.findOrCreate({
    where: { userId, productId },
    defaults: { cityId },
  });
}

async function removeFromWishlist(userId, productId) {
  return WishlistItem.destroy({ where: { userId, productId } });
}

module.exports = {
  listWishlist,
  addToWishlist,
  removeFromWishlist,
};


