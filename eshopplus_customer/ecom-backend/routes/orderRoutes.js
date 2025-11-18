const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_orders' },
  { path: 'place_order' },
  { path: 'update_order_item_status' },
  { path: 'update_order_status' },
  { path: 'delete_order', methods: ['post', 'delete'] },
  { path: 'download_order_invoice', methods: ['get', 'post'] },
  { path: 'download_link_hash', methods: ['get', 'post'] },
  { path: 'transactions' },
  { path: 'get_withdrawal_request' },
  { path: 'send_withdrawal_request' },
]);

module.exports = router;

