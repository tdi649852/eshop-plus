const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LIVE_BASE_URL = 'https://eshop-pro.eshopweb.store';
const MOCK_DATA_DIR = path.join(__dirname, '..', 'mockData');
const DEFAULT_STORE_ID = 38;
const DEFAULT_USER_ID = 1;
const DEFAULT_LIMIT = 10;

// Endpoints that need specific parameters
const parameterizedEndpoints = [
  {
    name: 'get_products',
    url: `${LIVE_BASE_URL}/api/get_products?store_id=${DEFAULT_STORE_ID}&limit=${DEFAULT_LIMIT}&offset=0`,
  },
  {
    name: 'get_combo_products',
    url: `${LIVE_BASE_URL}/api/get_combo_products?store_id=${DEFAULT_STORE_ID}&limit=${DEFAULT_LIMIT}&offset=0`,
  },
  {
    name: 'get_categories',
    url: `${LIVE_BASE_URL}/api/get_categories?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_categories_sliders',
    url: `${LIVE_BASE_URL}/api/get_categories_sliders?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_brands',
    url: `${LIVE_BASE_URL}/api/get_brands?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_sections',
    url: `${LIVE_BASE_URL}/api/get_sections?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'search_products',
    url: `${LIVE_BASE_URL}/api/search_products?search=shirt&store_id=${DEFAULT_STORE_ID}&limit=${DEFAULT_LIMIT}`,
  },
  {
    name: 'get_product_rating',
    url: `${LIVE_BASE_URL}/api/get_product_rating?product_id=1`,
  },
  {
    name: 'get_similar_products',
    url: `${LIVE_BASE_URL}/api/get_similar_products?product_id=1&store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_combo_similar_products',
    url: `${LIVE_BASE_URL}/api/get_combo_similar_products?product_id=1&store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_product_faqs',
    url: `${LIVE_BASE_URL}/api/get_product_faqs?product_id=1`,
  },
  {
    name: 'get_zipcode_by_city_id',
    url: `${LIVE_BASE_URL}/api/get_zipcode_by_city_id?city_id=1`,
  },
  {
    name: 'get_offer_images',
    url: `${LIVE_BASE_URL}/api/get_offer_images?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_slider_images',
    url: `${LIVE_BASE_URL}/api/get_slider_images?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'get_offers_sliders',
    url: `${LIVE_BASE_URL}/api/get_offers_sliders?store_id=${DEFAULT_STORE_ID}`,
  },
  {
    name: 'is_product_delivarable',
    url: `${LIVE_BASE_URL}/api/is_product_delivarable?product_id=1&zipcode=110001`,
  },
  {
    name: 'is_seller_delivarable',
    url: `${LIVE_BASE_URL}/api/is_seller_delivarable?seller_id=1&zipcode=110001`,
  },
  {
    name: 'get_sellers',
    url: `${LIVE_BASE_URL}/api/get_sellers?store_id=${DEFAULT_STORE_ID}&user_id=${DEFAULT_USER_ID}&limit=${DEFAULT_LIMIT}&offset=0`,
  },
  {
    name: 'top_sellers',
    url: `${LIVE_BASE_URL}/api/top_sellers?store_id=${DEFAULT_STORE_ID}&user_id=${DEFAULT_USER_ID}`,
  },
  {
    name: 'best_sellers',
    url: `${LIVE_BASE_URL}/api/best_sellers?store_id=${DEFAULT_STORE_ID}&user_id=${DEFAULT_USER_ID}&limit=${DEFAULT_LIMIT}&offset=0`,
  },
  {
    name: 'most_selling_products',
    url: `${LIVE_BASE_URL}/api/most_selling_products?store_id=${DEFAULT_STORE_ID}&user_id=${DEFAULT_USER_ID}`,
  },
];

async function fetchAndSave(endpoint) {
  const fileName = `${endpoint.name}.json`;
  const filePath = path.join(MOCK_DATA_DIR, fileName);

  try {
    console.log(`🔄 Fetching ${endpoint.name}...`);
    
    const response = await axios({
      method: 'get',
      url: endpoint.url,
      timeout: 10000,
      validateStatus: () => true,
    });

    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), 'utf8');
    console.log(`✅ Saved ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to fetch ${endpoint.name}: ${error.message}`);
  }
}

async function fetchAll() {
  console.log('🚀 Fetching parameterized endpoints...\n');
  
  for (const endpoint of parameterizedEndpoints) {
    await fetchAndSave(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✨ Parameterized endpoints fetched!');
}

fetchAll().catch(console.error);

