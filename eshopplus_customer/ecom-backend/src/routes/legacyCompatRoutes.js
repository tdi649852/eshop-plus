const express = require('express');
const catchAsync = require('../utils/catchAsync');
const authMiddleware = require('../middlewares/authMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');
const legacyAuthService = require('../services/legacy/legacyAuthService');
const legacyLocationService = require('../services/legacy/legacyLocationService');
const legacyAddressService = require('../services/legacy/legacyAddressService');
const legacyCartService = require('../services/legacy/legacyCartService');
const legacyWishlistService = require('../services/legacy/legacyWishlistService');
const legacyOrderService = require('../services/legacy/legacyOrderService');

const router = express.Router();

// Auth endpoints
router.post('/verify_user', catchAsync(legacyAuthService.handleVerifyUser));
router.post('/login', catchAsync(legacyAuthService.handleLogin));
router.post('/register_user', catchAsync(legacyAuthService.handleRegister));

// Location
router.get('/get_cities', catchAsync(legacyLocationService.listCities));

// Address book
router.get('/get_address', authMiddleware, catchAsync(legacyAddressService.listAddresses));
router.post('/add_address', authMiddleware, catchAsync(legacyAddressService.addAddress));
router.post('/update_address', authMiddleware, catchAsync(legacyAddressService.updateAddress));
router.post('/delete_address', authMiddleware, catchAsync(legacyAddressService.deleteAddress));

// Wishlist
router.get('/get_favorites', authMiddleware, catchAsync(legacyWishlistService.listFavorites));
router.post(
  '/add_to_favorites',
  authMiddleware,
  locationMiddleware,
  catchAsync(legacyWishlistService.addFavorite),
);
router.post(
  '/remove_from_favorites',
  authMiddleware,
  catchAsync(legacyWishlistService.removeFavorite),
);

// Cart
router.get(
  '/get_user_cart',
  authMiddleware,
  locationMiddleware,
  catchAsync(legacyCartService.getCart),
);
router.post(
  '/manage_cart',
  authMiddleware,
  locationMiddleware,
  catchAsync(legacyCartService.manageCart),
);
router.post(
  '/remove_from_cart',
  authMiddleware,
  catchAsync(legacyCartService.removeCartItem),
);
router.post('/clear_cart', authMiddleware, catchAsync(legacyCartService.clearCart));

// Orders
router.get('/get_orders', authMiddleware, catchAsync(legacyOrderService.listOrders));
router.post(
  '/place_order',
  authMiddleware,
  locationMiddleware,
  catchAsync(legacyOrderService.placeOrder),
);

module.exports = router;


