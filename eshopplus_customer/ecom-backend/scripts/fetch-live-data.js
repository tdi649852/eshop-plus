const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LIVE_API_BASE = 'https://eshop-pro.eshopweb.store/api';
const MOCK_DATA_DIR = path.join(__dirname, '..', 'mockData');

// Default store ID from get_stores.json (LuxeLine - eCommerce is the default store)
const DEFAULT_STORE_ID = '38';

// Endpoints that need store_id parameter
const endpointsToFetch = [
  { endpoint: 'get_categories', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_slider_images', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_offer_images', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_categories_sliders', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_offers_sliders', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_brands', params: { store_id: DEFAULT_STORE_ID } },
  { endpoint: 'get_products', params: { store_id: DEFAULT_STORE_ID, limit: 20, offset: 0 } },
];

async function fetchAndSaveEndpoint(endpoint, params) {
  try {
    console.log(`Fetching ${endpoint}...`);
    
    // Create FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Add all parameters to FormData
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    
    const response = await axios.post(
      `${LIVE_API_BASE}/${endpoint}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    const filePath = path.join(MOCK_DATA_DIR, `${endpoint}.json`);
    
    // Write the response data to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), 'utf8');
    
    console.log(`✅ Successfully saved ${endpoint}.json`);
    return true;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, JSON.stringify(error.response.data).substring(0, 200));
    }
    return false;
  }
}

async function fetchAllData() {
  console.log('🚀 Starting to fetch live data from the API...\n');
  
  let successCount = 0;
  let failCount = 0;

  for (const { endpoint, params } of endpointsToFetch) {
    const success = await fetchAndSaveEndpoint(endpoint, params);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Add a small delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Total: ${endpointsToFetch.length}`);
  
  if (failCount === 0) {
    console.log('\n🎉 All mock data files have been successfully updated!');
  } else {
    console.log('\n⚠️  Some endpoints failed. Check the errors above.');
  }
}

// Run the script
fetchAllData().catch(console.error);

