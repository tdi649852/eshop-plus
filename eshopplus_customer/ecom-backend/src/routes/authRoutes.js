const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');

const router = express.Router();

router.post('/register/customer', locationMiddleware, authController.registerCustomer);
router.post('/register/retailer', locationMiddleware, authController.registerRetailer);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authMiddleware, authController.profile);
router.put('/me', authMiddleware, authController.updateProfile);

module.exports = router;


