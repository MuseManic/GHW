#!/usr/bin/env node

/**
 * Quick test script for registration endpoint
 * Run: node test-register.js
 */

const http = require('http');
const https = require('https');

// WordPress credentials from .env
const WORDPRESS_USERNAME = 'corbettc';
const WORDPRESS_PASSWORD = 'PUub Wr9d de2x DJFw i0Al mLx1';
const WORDPRESS_API_URL = 'https://botaanidev.wpengine.com/za/wp-json';

// Test data - using strong password that meets WordPress requirements
const testData = {
  email: 'testuser' + Date.now() + '@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'Secure@Pass2024!',
  confirmPassword: 'Secure@Pass2024!',
};

console.log('📤 SENDING REQUEST:\n');
console.log(JSON.stringify(testData, null, 2));
console.log('\n' + '='.repeat(60) + '\n');

// Make request to local dev server
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 RESPONSE:\n');
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('\nBody:');
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\nMake sure your Next.js dev server is running on localhost:3000');
  console.log('Run: npm run dev');
});

req.write(JSON.stringify(testData));
req.end();

// Also test WordPress API directly
console.log('\n\n' + '='.repeat(60));
console.log('🔍 TESTING WORDPRESS API DIRECTLY\n');

const basicAuth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');

const wpOptions = {
  hostname: 'botaanidev.wpengine.com',
  path: '/za/wp-json/wp/v2/users',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${basicAuth}`,
  },
};

const wpReq = https.request(wpOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('WordPress API Status:', res.statusCode);
    console.log('Response:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log(data);
    }
  });
});

wpReq.on('error', (error) => {
  console.error('❌ WordPress API request failed:', error.message);
});

wpReq.end();
