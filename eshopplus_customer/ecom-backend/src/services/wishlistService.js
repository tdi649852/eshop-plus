const wishlistRepository = require('../repositories/wishlistRepository');

async function getWishlist(userId) {
  return wishlistRepository.listWishlist(userId);
}

async function addToWishlist(userId, productId, cityId) {
  await wishlistRepository.addToWishlist(userId, productId, cityId);
  return getWishlist(userId);
}

async function removeFromWishlist(userId, productId) {
  await wishlistRepository.removeFromWishlist(userId, productId);
  return getWishlist(userId);
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};


