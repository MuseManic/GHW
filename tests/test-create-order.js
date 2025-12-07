// Test WooCommerce Order Creation
// Run with: node test-create-order.js

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
    value = value.replace(/^['"](.*)['"]$/, '$1');
    envVars[key] = value;
  }
});

const baseURL = envVars.NEXT_PUBLIC_WORDPRESS_API_URL;
const consumerKey = envVars.WORDPRESS_API_USERNAME;
const consumerSecret = envVars.WORDPRESS_API_PASSWORD;

console.log('Testing WooCommerce Order Creation...\n');
console.log('Configuration:');
console.log('- Base URL:', baseURL);
console.log('- Consumer Key:', consumerKey ? `${consumerKey.substring(0, 6)}...` : 'MISSING');
console.log('\n---\n');

async function testOrderCreation() {
  try {
    console.log('Creating test order...\n');

    const orderData = {
      payment_method: 'payfast',
      payment_method_title: 'PayFast',
      set_paid: false,
      billing: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '0821234567',
        address_1: '123 Test Street',
        city: 'Cape Town',
        state: 'Western Cape',
        postcode: '8001',
        country: 'ZA'
      },
      shipping: {
        first_name: 'Test',
        last_name: 'User',
        address_1: '123 Test Street',
        city: 'Cape Town',
        state: 'Western Cape',
        postcode: '8001',
        country: 'ZA'
      },
      line_items: [
        {
          product_id: 94, // Botaani Cannafusion
          quantity: 1
        }
      ],
      status: 'pending'
    };

    console.log('Order data:', JSON.stringify(orderData, null, 2));
    console.log('\nSending request...\n');

    const response = await axios.post(
      `${baseURL}/wc/v3/orders`,
      orderData,
      {
        auth: {
          username: consumerKey,
          password: consumerSecret
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ SUCCESS! Order created\n');
    console.log('Order Details:');
    console.log('- Order ID:', response.data.id);
    console.log('- Order Key:', response.data.order_key);
    console.log('- Status:', response.data.status);
    console.log('- Total:', response.data.total);
    console.log('- Currency:', response.data.currency);
    console.log('\nCheckout URL:');
    console.log(`${envVars.NEXT_PUBLIC_WORDPRESS_URL}checkout/order-pay/${response.data.id}/?pay_for_order=true&key=${response.data.order_key}`);

  } catch (error) {
    console.error('❌ ERROR: Failed to create order\n');

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
      
      if (typeof error.response.data === 'string') {
        console.error('\nResponse is HTML (WordPress error page)');
        console.error('First 500 characters:');
        console.error(error.response.data.substring(0, 500));
        
        // Try to extract error
        const titleMatch = error.response.data.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
          console.error('\nPage Title:', titleMatch[1]);
        }
        
        console.error('\n⚠️  This indicates a WordPress/PHP error');
        console.error('Possible causes:');
        console.error('1. WooCommerce not properly configured');
        console.error('2. PayFast gateway not enabled');
        console.error('3. Missing required WooCommerce settings');
        console.error('4. PHP error in WordPress');
        console.error('\nCheck WordPress error logs:');
        console.error('- wp-content/debug.log (if WP_DEBUG is enabled)');
        console.error('- Server error logs');
      } else {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      }
    } else if (error.request) {
      console.error('No response received from server.');
      console.error('Check your URL:', baseURL);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testOrderCreation();
