const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_paypal_link' },
  { path: 'add_transaction' },
  { path: 'phonepe_app' },
  { path: 'razorpay_create_order' },
  { path: 'app_payment_status' },
  { path: 'paystack_webview' },
  { path: 'handle_paystack_callback' },
  { path: 'send_bank_transfer_proof' },
]);

module.exports = router;

