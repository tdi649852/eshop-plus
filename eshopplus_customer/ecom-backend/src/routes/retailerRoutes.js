const express = require('express');
const retailerController = require('../controllers/retailerController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/', locationMiddleware, retailerController.listRetailers);
router.get(
  '/me',
  authMiddleware,
  authorizeRoles(USER_ROLES.RETAILER),
  retailerController.getMyStore,
);
router.get(
  '/dashboard/metrics',
  authMiddleware,
  authorizeRoles(USER_ROLES.RETAILER),
  retailerController.dashboard,
);
router.patch(
  '/:id/status',
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN),
  retailerController.updateStatus,
);
router.patch(
  '/:id',
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN),
  retailerController.updateProfile,
);

module.exports = router;


