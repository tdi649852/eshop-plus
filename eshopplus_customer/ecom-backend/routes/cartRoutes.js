const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_user_cart' },
  { path: 'clear_cart' },
  { path: 'remove_from_cart' },
  { path: 'manage_cart' },
]);

module.exports = router;

