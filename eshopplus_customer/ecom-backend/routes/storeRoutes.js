const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_stores' },
  { path: 'get_settings' },
  { path: 'get_languages' },
  { path: 'get_language_labels' },
  { path: 'get_sections' },
  { path: 'get_sellers' },
  { path: 'best_sellers' },
  { path: 'top_sellers' },
  { path: 'get_brands' },
  { path: 'get_offer_images' },
  { path: 'get_slider_images' },
  { path: 'get_offers_sliders' },
]);

module.exports = router;

