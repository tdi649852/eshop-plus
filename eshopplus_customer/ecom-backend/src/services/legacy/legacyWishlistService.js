const ApiError = require('../../utils/apiError');
const wishlistService = require('../wishlistService');
const { formatWishlistItem, buildMessageKey } = require('./legacyFormatter');

async function listFavorites(req, res) {
  const items = await wishlistService.getWishlist(req.user.id);
  return res.json({
    error: false,
    message: 'Favorites retrieved successfully',
    language_message_key: buildMessageKey('Favorites retrieved successfully'),
    total: items.length.toString(),
    data: items.map(formatWishlistItem),
  });
}

async function addFavorite(req, res) {
  const { product_id: productId } = req.body;
  if (!productId) {
    throw new ApiError(400, 'product_id is required');
  }
  await wishlistService.addToWishlist(req.user.id, productId, req.cityId);
  return listFavorites(req, res);
}

async function removeFavorite(req, res) {
  const { product_id: productId } = req.body;
  if (!productId) {
    throw new ApiError(400, 'product_id is required');
  }
  await wishlistService.removeFromWishlist(req.user.id, productId);
  return listFavorites(req, res);
}

module.exports = {
  listFavorites,
  addFavorite,
  removeFavorite,
};


