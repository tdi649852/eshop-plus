const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_tickets' },
  { path: 'add_ticket' },
  { path: 'edit_ticket' },
  { path: 'get_ticket_types' },
]);

module.exports = router;

