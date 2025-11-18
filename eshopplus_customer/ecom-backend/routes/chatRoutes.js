const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'chatify/api/chat/auth', methods: ['post'] },
  { path: 'chatify/api/sendMessage', methods: ['post'] },
  { path: 'chatify/api/fetchMessages', methods: ['get', 'post'] },
  { path: 'chatify/api/search', methods: ['get', 'post'] },
  { path: 'chatify/api/getContacts', methods: ['get', 'post'] },
  { path: 'chatify/api/makeSeen', methods: ['post'] },
  { path: 'api/get_messages', mockName: 'get_messages' },
  { path: 'api/send_message', mockName: 'send_message' },
]);

module.exports = router;

