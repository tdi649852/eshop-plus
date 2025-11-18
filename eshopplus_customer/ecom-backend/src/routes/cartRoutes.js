const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', locationMiddleware, cartController.addItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;


