// Test WooCommerce API Connection
// Run with: node test-woocommerce.js

const axios = require('axios');

// Hard-coded test credentials
const baseURL = "https://botaanidev.wpengine.com/za/wp-json;"  
const consumerKey = "ck_178770bd9153327002d75daf4bad19cc4a95e9e9";                   // <- change this
const consumerSecret = "cs_320ec69dd9af49c8696043ba0379429fcad5b7d5";                // <- change this

console.log('Testing WooCommerce API Connection...\n');
console.log('Configuration:');
console.log('- Base URL:', baseURL);
console.log('- Consumer Key:', consumerKey ? `${consumerKey.substring(0, 6)}...` : 'MISSING');
console.log('- Consumer Secret:', consumerSecret ? '***' : 'MISSING');
console.log('\n---\n');

async function testConnection() {
  try {
    console.log('Attempting to fetch products...');

    const response = await axios.get(`${baseURL}/wc/v3/products`, {
      auth: {
        username: consumerKey,
        password: consumerSecret
      },
      params: { per_page: 5 }
    });

    console.log('✅ SUCCESS! Connected to WooCommerce API\n');
    console.log(`Found ${response.data.length} products:\n`);

    response.data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug}) - R${product.price}`);
    });

  } catch (error) {
    console.error('❌ ERROR: Failed to connect to WooCommerce API\n');

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 401) {
        console.error('\n⚠️ AUTHENTICATION FAILED');
        console.error('Your WooCommerce consumer key or secret is wrong.');
      }

    } else if (error.request) {
      console.error('No response received from server.');
      console.error('Check your URL:', baseURL);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testConnection();
