const express = require('express');
const { registerMockEndpoints } = require('../utils/registerEndpoints');

const router = express.Router();

registerMockEndpoints(router, [
  { path: 'get_categories' },
  { path: 'get_categories_sliders' },
  { path: 'get_products' },
  { path: 'get_combo_products' },
  { path: 'get_combo_product_rating' },
  { path: 'get_product_rating' },
  { path: 'set_product_rating' },
  { path: 'set_combo_product_rating' },
  { path: 'search_products' },
  { path: 'check_cart_products_delivarable' },
  { path: 'get_most_searched_history' },
  { path: 'get_similar_products' },
  { path: 'get_combo_similar_products' },
  { path: 'is_product_delivarable' },
  { path: 'is_seller_delivarable' },
  { path: 'get_faqs' },
  { path: 'get_product_faqs' },
  { path: 'add_product_faqs' },
  { path: 'most_selling_products' },
]);

module.exports = router;

