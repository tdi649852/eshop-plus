const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_address' },
  { path: 'add_address' },
  { path: 'update_address' },
  { path: 'delete_address', methods: ['post', 'delete'] },
  { path: 'get_cities' },
  { path: 'get_zipcode_by_city_id' },
  { path: 'get_zipcodes' },
]);

module.exports = router;

