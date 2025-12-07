# How to Generate WooCommerce API Keys

## Problem
You're getting this error:
```
{"error":"Failed to fetch products"}
```

This is because you need **WooCommerce API keys**, not WordPress admin credentials.

## Solution: Generate WooCommerce API Keys

### Step 1: Log into WordPress Admin
Go to: `https://botaanidev.wpengine.com/za/wp-admin`

### Step 2: Navigate to WooCommerce REST API Settings
1. In the left sidebar, click **WooCommerce**
2. Click **Settings**
3. Click the **Advanced** tab
4. Click **REST API**

### Step 3: Add New API Key
1. Click the **"Add Key"** button
2. Fill in the form:
   - **Description**: `Next.js Frontend` (or any name you want)
   - **User**: Select your admin user (probably `corbettc`)
   - **Permissions**: Select **Read/Write**
3. Click **"Generate API Key"**

### Step 4: Copy Your Keys
You'll see two keys displayed:

```
Consumer Key: ck_1234567890abcdef1234567890abcdef12345678
Consumer Secret: cs_1234567890abcdef1234567890abcdef12345678
```

⚠️ **IMPORTANT**: Copy both keys immediately! The Consumer Secret will only be shown once.

### Step 5: Update `.env.local`

Replace these lines in your `.env.local` file:

**OLD (WordPress admin credentials - doesn't work for WooCommerce API):**
```env
WORDPRESS_API_USERNAME=botaanidev-cor
WORDPRESS_API_PASSWORD=KxW6FtG5xXiNseY
```

**NEW (WooCommerce API keys):**
```env
WORDPRESS_API_USERNAME=ck_your_consumer_key_here
WORDPRESS_API_PASSWORD=cs_your_consumer_secret_here
```

Replace `ck_your_consumer_key_here` with your actual Consumer Key and `cs_your_consumer_secret_here` with your actual Consumer Secret.

### Step 6: Restart Your Dev Server

After updating `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Test the API: `http://localhost:3000/api/products`

## Test the Connection

Run this test script to verify:
```bash
node test-woocommerce.js
```

You should see:
```
✅ SUCCESS! Connected to WooCommerce API

Found 4 products:
1. Botaani Cannafusion (botaani-cannafusion) - R1500
2. Botaani Serum (botaani-serum) - R799
3. Botaani Face (botaani-face) - R699
4. Botaani Body (botaani-body) - R499
```

## What's the Difference?

| Credential Type | Purpose | Format |
|----------------|---------|--------|
| **WordPress Admin** | User login, authentication | Username + Password |
| **WooCommerce API Keys** | REST API access to products | Consumer Key (ck_...) + Consumer Secret (cs_...) |

Your `.env.local` needs **BOTH**:
- `WORDPRESS_USERNAME` / `WORDPRESS_PASSWORD` - For user authentication (login/register)
- `WORDPRESS_API_USERNAME` / `WORDPRESS_API_PASSWORD` - For WooCommerce products (API access)

## Troubleshooting

### "I can't find the REST API option"
- Make sure WooCommerce plugin is installed and activated
- Check you're logged in as an administrator

### "I lost my Consumer Secret"
- You'll need to delete the old key and generate a new one
- WooCommerce doesn't store the secret for security reasons

### "Still getting 401 error"
- Double-check you copied the keys correctly (no extra spaces)
- Make sure the API key has "Read/Write" permissions
- Verify the key is enabled (not revoked)

## Next Steps

Once you have the keys working:
1. ✅ Test API endpoint: `http://localhost:3000/api/products`
2. ✅ Fill in ACF fields for your products
3. ✅ Test product pages: `http://localhost:3000/products/botaani-cannafusion`
