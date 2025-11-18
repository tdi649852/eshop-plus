const express = require('express');
const authRoutes = require('./authRoutes');
const locationRoutes = require('./locationRoutes');
const retailerRoutes = require('./retailerRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const orderRoutes = require('./orderRoutes');
const addressRoutes = require('./addressRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/retailers', retailerRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);

module.exports = router;


