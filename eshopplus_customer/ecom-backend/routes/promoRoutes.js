const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_promo_codes' },
  { path: 'validate_promo_code' },
  { path: 'validate_refer_code' },
]);

module.exports = router;

