const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// Controllers
const advtezRetailerController = require('../controllers/advtezRetailerController');
const discountController = require('../controllers/discountController');
const walletController = require('../controllers/walletController');
const homeController = require('../controllers/homeController');
const advertisementController = require('../controllers/advertisementController');
const analyticsController = require('../controllers/analyticsController');
const notificationController = require('../controllers/notificationController');
const adminController = require('../controllers/adminController');
const orderExtendedController = require('../controllers/orderExtendedController');

// ==========================================
// RETAILER ROUTES
// ==========================================
router.post('/retailer/onboard', authenticate, advtezRetailerController.onboardRetailer);
router.get('/retailer/profile', authenticate, authorizeRoles('retailer'), advtezRetailerController.getRetailerProfile);
router.put('/retailer/profile', authenticate, authorizeRoles('retailer'), advtezRetailerController.updateRetailerProfile);

// Branch management
router.post('/retailer/branch', authenticate, authorizeRoles('retailer'), advtezRetailerController.createBranch);
router.get('/retailer/branches', authenticate, authorizeRoles('retailer'), advtezRetailerController.getBranches);
router.put('/retailer/branch/:id', authenticate, authorizeRoles('retailer'), advtezRetailerController.updateBranch);

// Followers
router.get('/retailer/followers', authenticate, authorizeRoles('retailer'), advtezRetailerController.getFollowers);

// Discount management
router.put('/retailer/discount/toggle', authenticate, authorizeRoles('retailer'), advtezRetailerController.toggleDiscounts);
router.put('/retailer/discount/store', authenticate, authorizeRoles('retailer'), advtezRetailerController.setStoreDiscount);

// ==========================================
// DISCOUNT ROUTES
// ==========================================
// Hot Deals
router.post('/retailer/discount/hot-deal', authenticate, authorizeRoles('retailer'), discountController.createHotDeal);
router.get('/retailer/discount/hot-deals', authenticate, authorizeRoles('retailer'), discountController.getHotDeals);
router.put('/retailer/discount/hot-deal/:id', authenticate, authorizeRoles('retailer'), discountController.updateHotDeal);
router.delete('/retailer/discount/hot-deal/:id', authenticate, authorizeRoles('retailer'), discountController.deleteHotDeal);

// Category Discounts
router.post('/retailer/discount/category', authenticate, authorizeRoles('retailer'), discountController.createCategoryDiscount);
router.get('/retailer/discount/categories', authenticate, authorizeRoles('retailer'), discountController.getCategoryDiscounts);

// Product Discounts
router.post('/retailer/discount/product', authenticate, authorizeRoles('retailer'), discountController.createProductDiscount);
router.get('/retailer/discount/products', authenticate, authorizeRoles('retailer'), discountController.getProductDiscounts);

// Bank Offers
router.post('/retailer/discount/bank-offer', authenticate, authorizeRoles('retailer'), discountController.createBankOffer);
router.get('/retailer/discount/bank-offers', authenticate, authorizeRoles('retailer'), discountController.getBankOffers);

// Public deals
router.get('/deals', discountController.getAllDeals);

// ==========================================
// WALLET ROUTES
// ==========================================
router.get('/wallet/balance', authenticate, walletController.getWalletBalance);
router.post('/wallet/add-money', authenticate, walletController.addMoney);
router.post('/wallet/withdraw', authenticate, authorizeRoles('retailer'), walletController.requestWithdrawal);
router.get('/wallet/transactions', authenticate, walletController.getTransactions);

// ==========================================
// HOME & DISCOVERY ROUTES
// ==========================================
router.get('/home', homeController.getHomeData);
router.get('/explore/retailers', homeController.exploreRetailers);
router.get('/retailers/:id/profile', homeController.getRetailerPublicProfile);
router.get('/search', homeController.unifiedSearch);

// ==========================================
// ADVERTISEMENT ROUTES
// ==========================================
router.post('/ads/create', authenticate, authorizeRoles('retailer'), advertisementController.createAdvertisement);
router.get('/ads/my-ads', authenticate, authorizeRoles('retailer'), advertisementController.getMyAdvertisements);
router.get('/ads/:id/report', authenticate, authorizeRoles('retailer'), advertisementController.getAdvertisementReport);
router.delete('/ads/:id/cancel', authenticate, authorizeRoles('retailer'), advertisementController.cancelAdvertisement);

// ==========================================
// ANALYTICS ROUTES
// ==========================================
router.get('/retailer/analytics', authenticate, authorizeRoles('retailer'), analyticsController.getRetailerAnalytics);

// ==========================================
// NOTIFICATION ROUTES
// ==========================================
router.get('/notifications', authenticate, notificationController.getNotifications);
router.put('/notifications/:id/read', authenticate, notificationController.markNotificationRead);

// ==========================================
// SUPPORT TICKET ROUTES
// ==========================================
router.post('/support/ticket', authenticate, notificationController.createSupportTicket);
router.get('/support/tickets', authenticate, notificationController.getSupportTickets);
router.get('/support/tickets/:id', authenticate, notificationController.getSupportTicketDetails);
router.post('/support/tickets/:id/message', authenticate, notificationController.addTicketMessage);

// ==========================================
// ORDER EXTENDED ROUTES
// ==========================================
router.post('/orders/:id/parcel', authenticate, authorizeRoles('retailer'), orderExtendedController.createOrderParcel);
router.get('/orders/:id/parcels', authenticate, orderExtendedController.getOrderParcels);
router.put('/orders/:id/parcels/:parcelId', authenticate, authorizeRoles('retailer'), orderExtendedController.updateParcelStatus);
router.post('/orders/:id/return', authenticate, orderExtendedController.requestReturn);
router.put('/orders/:id/cancel', authenticate, orderExtendedController.cancelOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================
// Retailer approvals
router.get('/admin/retailers/pending', authenticate, authorizeRoles('admin'), adminController.getPendingRetailers);
router.put('/admin/retailers/:id/approve', authenticate, authorizeRoles('admin'), adminController.approveRetailer);
router.put('/admin/retailers/:id/reject', authenticate, authorizeRoles('admin'), adminController.rejectRetailer);

// Product approvals
router.get('/admin/products/pending', authenticate, authorizeRoles('admin'), adminController.getPendingProducts);
router.put('/admin/products/:id/approve', authenticate, authorizeRoles('admin'), adminController.approveProduct);

// Category management
router.post('/admin/categories', authenticate, authorizeRoles('admin'), adminController.createCategory);

// Featured retailers
router.post('/admin/featured-retailer/:id', authenticate, authorizeRoles('admin'), adminController.setFeaturedRetailer);

// Banner management
router.post('/admin/banner', authenticate, authorizeRoles('admin'), adminController.createBanner);
router.get('/admin/banners', authenticate, authorizeRoles('admin'), adminController.getBanners);
router.put('/admin/banners/:id', authenticate, authorizeRoles('admin'), adminController.updateBanner);
router.delete('/admin/banners/:id', authenticate, authorizeRoles('admin'), adminController.deleteBanner);

// Advertisement approvals
router.get('/admin/advertisements/pending', authenticate, authorizeRoles('admin'), adminController.getPendingAdvertisements);
router.put('/admin/advertisements/:id/approve', authenticate, authorizeRoles('admin'), adminController.approveAdvertisement);

// Withdrawal approvals
router.get('/admin/withdrawals/pending', authenticate, authorizeRoles('admin'), adminController.getPendingWithdrawals);
router.put('/admin/withdrawals/:id/approve', authenticate, authorizeRoles('admin'), adminController.approveWithdrawal);

// Return approvals
router.put('/admin/orders/:id/return/approve', authenticate, authorizeRoles('admin'), orderExtendedController.approveReturn);

module.exports = router;
