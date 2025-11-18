const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'register_user' },
  { path: 'login' },
  { path: 'verify_user' },
  { path: 'sign_up' },
  { path: 'reset_password' },
  { path: 'update_fcm' },
  { path: 'update_user' },
  { path: 'verify_otp' },
  { path: 'resend_otp' },
  { path: 'get_notifications' },
  { path: 'get_favorites' },
  { path: 'add_to_favorites' },
  { path: 'remove_from_favorites' },
  { path: 'delete_user', methods: ['post', 'delete'] },
  { path: 'delete_social_account', methods: ['post', 'delete'] },
]);

module.exports = router;

