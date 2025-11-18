const express = require('express');

const legacyStoreRoutes = require('../../routes/storeRoutes');
const legacyProductRoutes = require('../../routes/productRoutes');
const legacyUserRoutes = require('../../routes/userRoutes');
const legacyAddressRoutes = require('../../routes/addressRoutes');
const legacyCartRoutes = require('../../routes/cartRoutes');
const legacyOrderRoutes = require('../../routes/orderRoutes');
const legacyPaymentRoutes = require('../../routes/paymentRoutes');
const legacyPromoRoutes = require('../../routes/promoRoutes');
const legacyTicketRoutes = require('../../routes/ticketRoutes');
const legacyChatRoutes = require('../../routes/chatRoutes');
const legacyCompatController = require('../controllers/legacyCompatController');

const router = express.Router();

router.get('/get_sellers', legacyCompatController.getSellers);
router.post('/get_sellers', legacyCompatController.getSellers);

router.use('/', legacyStoreRoutes);
router.use('/', legacyProductRoutes);
router.use('/', legacyUserRoutes);
router.use('/', legacyAddressRoutes);
router.use('/', legacyCartRoutes);
router.use('/', legacyOrderRoutes);
router.use('/', legacyPaymentRoutes);
router.use('/', legacyPromoRoutes);
router.use('/', legacyTicketRoutes);
router.use('/', legacyChatRoutes);

module.exports = router;


