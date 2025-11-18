const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/', locationMiddleware, wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;


