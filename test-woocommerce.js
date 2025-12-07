// Test WooCommerce API Connection
// Run with: node test-woocommerce.js

const axios = require('axios');
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    value = value.replace(/^['"](.*)['"]$/, '$1');
    envVars[key] = value;
  }
});

const baseURL = envVars.NEXT_PUBLIC_WORDPRESS_API_URL;
const username = envVars.WORDPRESS_API_USERNAME;
const password = envVars.WORDPRESS_API_PASSWORD;

console.log('Testing WooCommerce API Connection...\n');
console.log('Configuration:');
console.log('- Base URL:', baseURL);
console.log('- Username:', username ? `${username.substring(0, 5)}...` : 'MISSING');
console.log('- Password:', password ? '***' : 'MISSING');
console.log('\n---\n');

async function testConnection() {
  try {
    console.log('Attempting to fetch products...');
    const response = await axios.get(`${baseURL}/wc/v3/products`, {
      auth: {
        username: username,
        password: password
      },
      params: {
        per_page: 5
      }
    });

    console.log('✅ SUCCESS! Connected to WooCommerce API\n');
    console.log(`Found ${response.data.length} products:`);
    response.data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug}) - R${product.price}`);
      console.log(`   Has ACF: ${!!product.acf ? 'Yes' : 'No'}`);
      if (product.acf) {
        console.log(`   ACF Fields: ${Object.keys(product.acf).join(', ')}`);
      }
    });
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to WooCommerce API\n');
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n⚠️  AUTHENTICATION FAILED');
        console.error('Your credentials are incorrect or you need WooCommerce API keys.');
        console.error('\nTo generate WooCommerce API keys:');
        console.error('1. Go to: WooCommerce → Settings → Advanced → REST API');
        console.error('2. Click "Add Key"');
        console.error('3. Set permissions to "Read/Write"');
        console.error('4. Copy the Consumer Key and Consumer Secret');
        console.error('5. Update .env.local:');
        console.error('   WORDPRESS_API_USERNAME=ck_your_consumer_key');
        console.error('   WORDPRESS_API_PASSWORD=cs_your_consumer_secret');
      }
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Check if WordPress URL is correct:', baseURL);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testConnection();
