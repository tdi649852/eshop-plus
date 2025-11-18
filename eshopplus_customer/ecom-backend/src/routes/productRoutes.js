const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const locationMiddleware = require('../middlewares/locationMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/', locationMiddleware, productController.listProducts);

router.post(
  '/',
  authMiddleware,
  authorizeRoles(USER_ROLES.RETAILER),
  productController.createProduct,
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(USER_ROLES.RETAILER),
  productController.updateProduct,
);

router.post(
  '/:id/images',
  authMiddleware,
  authorizeRoles(USER_ROLES.RETAILER),
  (req, res, next) => {
    req.uploadFolder = 'products';
    next();
  },
  upload.array('images', 5),
  productController.uploadImages,
);

module.exports = router;


