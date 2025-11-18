const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authMiddleware);

router.get('/', orderController.listOrders);
router.post('/', locationMiddleware, orderController.placeOrder);
router.patch(
  '/:id/status',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.RETAILER),
  orderController.updateStatus,
);

module.exports = router;


