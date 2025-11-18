const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LIVE_BASE_URL = 'https://eshop-pro.eshopweb.store';
const MOCK_DATA_DIR = path.join(__dirname, '..', 'mockData');

// All endpoints from apiEndPoints.dart
const endpoints = [
  { path: 'get_stores', method: 'get' },
  { path: 'get_settings', method: 'get' },
  { path: 'get_languages', method: 'get' },
  { path: 'get_language_labels', method: 'get' },
  { path: 'register_user', method: 'post', skipSync: true }, // Auth endpoint - skip
  { path: 'login', method: 'post', skipSync: true }, // Auth endpoint - skip
  { path: 'verify_user', method: 'post', skipSync: true },
  { path: 'sign_up', method: 'post', skipSync: true },
  { path: 'reset_password', method: 'post', skipSync: true },
  { path: 'get_categories', method: 'get' },
  { path: 'get_categories_sliders', method: 'get' },
  { path: 'get_offer_images', method: 'get' },
  { path: 'get_slider_images', method: 'get' },
  { path: 'get_offers_sliders', method: 'get' },
  { path: 'update_fcm', method: 'post', skipSync: true },
  { path: 'top_sellers', method: 'get' },
  { path: 'get_products', method: 'get' },
  { path: 'get_combo_products', method: 'get' },
  { path: 'get_combo_product_rating', method: 'get' },
  { path: 'get_orders', method: 'get', skipSync: true }, // Requires auth
  { path: 'most_selling_products', method: 'get' },
  { path: 'get_sections', method: 'get' },
  { path: 'get_sellers', method: 'get' },
  { path: 'best_sellers', method: 'get' },
  { path: 'get_brands', method: 'get' },
  { path: 'update_user', method: 'post', skipSync: true },
  { path: 'get_faqs', method: 'get' },
  { path: 'get_product_faqs', method: 'get' },
  { path: 'add_product_faqs', method: 'post', skipSync: true },
  { path: 'transactions', method: 'get', skipSync: true },
  { path: 'get_withdrawal_request', method: 'get', skipSync: true },
  { path: 'get_address', method: 'get', skipSync: true },
  { path: 'add_address', method: 'post', skipSync: true },
  { path: 'update_address', method: 'post', skipSync: true },
  { path: 'get_cities', method: 'get' },
  { path: 'get_zipcode_by_city_id', method: 'get' },
  { path: 'get_zipcodes', method: 'get' },
  { path: 'delete_address', method: 'post', skipSync: true },
  { path: 'get_promo_codes', method: 'get' },
  { path: 'delete_user', method: 'post', skipSync: true },
  { path: 'delete_social_account', method: 'post', skipSync: true },
  { path: 'get_favorites', method: 'get', skipSync: true },
  { path: 'add_to_favorites', method: 'post', skipSync: true },
  { path: 'remove_from_favorites', method: 'post', skipSync: true },
  { path: 'download_order_invoice', method: 'get', skipSync: true },
  { path: 'download_link_hash', method: 'get', skipSync: true },
  { path: 'send_withdrawal_request', method: 'post', skipSync: true },
  { path: 'get_notifications', method: 'get', skipSync: true },
  { path: 'get_tickets', method: 'get', skipSync: true },
  { path: 'add_ticket', method: 'post', skipSync: true },
  { path: 'edit_ticket', method: 'post', skipSync: true },
  { path: 'get_ticket_types', method: 'get' },
  { path: 'validate_promo_code', method: 'post', skipSync: true },
  { path: 'validate_refer_code', method: 'post', skipSync: true },
  { path: 'verify_otp', method: 'post', skipSync: true },
  { path: 'resend_otp', method: 'post', skipSync: true },
  { path: 'get_user_cart', method: 'get', skipSync: true },
  { path: 'clear_cart', method: 'post', skipSync: true },
  { path: 'remove_from_cart', method: 'post', skipSync: true },
  { path: 'manage_cart', method: 'post', skipSync: true },
  { path: 'place_order', method: 'post', skipSync: true },
  { path: 'update_order_item_status', method: 'post', skipSync: true },
  { path: 'update_order_status', method: 'post', skipSync: true },
  { path: 'get_product_rating', method: 'get' },
  { path: 'set_product_rating', method: 'post', skipSync: true },
  { path: 'set_combo_product_rating', method: 'post', skipSync: true },
  { path: 'search_products', method: 'get' },
  { path: 'check_cart_products_delivarable', method: 'post', skipSync: true },
  { path: 'get_most_searched_history', method: 'get' },
  { path: 'get_similar_products', method: 'get' },
  { path: 'get_combo_similar_products', method: 'get' },
  { path: 'is_product_delivarable', method: 'get' },
  { path: 'is_seller_delivarable', method: 'get' },
  { path: 'get_paypal_link', method: 'post', skipSync: true },
  { path: 'delete_order', method: 'post', skipSync: true },
  { path: 'add_transaction', method: 'post', skipSync: true },
  { path: 'phonepe_app', method: 'post', skipSync: true },
  { path: 'razorpay_create_order', method: 'post', skipSync: true },
  { path: 'app_payment_status', method: 'get', skipSync: true },
  { path: 'paystack_webview', method: 'get', skipSync: true },
  { path: 'handle_paystack_callback', method: 'post', skipSync: true },
  { path: 'get_messages', method: 'get', skipSync: true },
  { path: 'send_message', method: 'post', skipSync: true },
  { path: 'send_bank_transfer_proof', method: 'post', skipSync: true },
];

// Ensure mockData directory exists
if (!fs.existsSync(MOCK_DATA_DIR)) {
  fs.mkdirSync(MOCK_DATA_DIR, { recursive: true });
}

async function fetchAndSave(endpoint) {
  if (endpoint.skipSync) {
    console.log(`⏭️  Skipping ${endpoint.path} (requires auth or user-specific data)`);
    return;
  }

  const url = `${LIVE_BASE_URL}/api/${endpoint.path}`;
  const fileName = `${endpoint.path}.json`;
  const filePath = path.join(MOCK_DATA_DIR, fileName);

  try {
    console.log(`🔄 Fetching ${endpoint.path}...`);
    
    const response = await axios({
      method: endpoint.method,
      url: url,
      timeout: 10000,
      validateStatus: () => true, // Accept any status code
    });

    // Save the response
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), 'utf8');
    console.log(`✅ Saved ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to fetch ${endpoint.path}: ${error.message}`);
    
    // Create a placeholder error response
    const errorResponse = {
      error: true,
      message: `Mock data not available for ${endpoint.path}`,
      note: 'This endpoint may require authentication or specific parameters'
    };
    
    fs.writeFileSync(filePath, JSON.stringify(errorResponse, null, 2), 'utf8');
    console.log(`⚠️  Created placeholder for ${fileName}`);
  }
}

async function syncAll() {
  console.log('🚀 Starting mock data sync from live API...\n');
  
  for (const endpoint of endpoints) {
    await fetchAndSave(endpoint);
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✨ Mock data sync completed!');
}

syncAll().catch(console.error);

