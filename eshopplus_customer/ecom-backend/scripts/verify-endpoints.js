const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const STORE_ID = '38';

const endpointsToTest = [
  'get_categories',
  'get_slider_images',
  'get_offer_images',
  'get_categories_sliders',
  'get_offers_sliders',
  'get_brands',
  'get_sections',
  'get_stores',
  'get_settings'
];

async function testEndpoint(endpoint) {
  try {
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('store_id', STORE_ID);
    
    const response = await axios.post(
      `${BASE_URL}/${endpoint}`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 5000
      }
    );

    const hasError = response.data.error === true;
    const hasData = response.data.data && (Array.isArray(response.data.data) || typeof response.data.data === 'object');
    
    if (hasError) {
      console.log(`❌ ${endpoint}: ERROR - ${response.data.message}`);
      return false;
    } else if (hasData) {
      const dataCount = Array.isArray(response.data.data) ? response.data.data.length : Object.keys(response.data.data).length;
      console.log(`✅ ${endpoint}: OK (${dataCount} items)`);
      return true;
    } else {
      console.log(`⚠️  ${endpoint}: Unexpected response structure`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint}: FAILED - ${error.message}`);
    return false;
  }
}

async function verifyAllEndpoints() {
  console.log('🔍 Verifying Mock API Endpoints...\n');
  console.log(`Testing against: ${BASE_URL}`);
  console.log(`Store ID: ${STORE_ID}\n`);
  
  let passCount = 0;
  let failCount = 0;

  for (const endpoint of endpointsToTest) {
    const success = await testEndpoint(endpoint);
    if (success) {
      passCount++;
    } else {
      failCount++;
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${passCount}/${endpointsToTest.length} passed`);
  console.log('='.repeat(50));
  
  if (failCount === 0) {
    console.log('\n✨ All endpoints are working correctly!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${failCount} endpoint(s) failed. Please check the errors above.`);
    process.exit(1);
  }
}

// Run verification
verifyAllEndpoints().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  console.log('\n💡 Make sure the mock API server is running:');
  console.log('   cd mock-api && npm start');
  process.exit(1);
});

