# WooCommerce + ACF Integration Setup Guide

This guide explains how to connect your Next.js site to WordPress WooCommerce with ACF (Advanced Custom Fields) Pro.

## Prerequisites

✅ WordPress site with:
- WooCommerce installed and activated
- ACF Pro installed and activated
- Products created in WooCommerce
- REST API enabled

## Step 1: Configure WordPress REST API

### 1.1 Enable WooCommerce REST API

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Fill in:
   - **Description**: Next.js Frontend
   - **User**: Select an admin user
   - **Permissions**: Read/Write
4. Click **Generate API Key**
5. **Save these credentials** (you'll need them for `.env.local`):
   - Consumer Key
   - Consumer Secret

### 1.2 Whitelist REST API in Wordfence (if installed)

1. Go to **Wordfence → Firewall → Manage Rate Limiting**
2. Add to whitelist:
   - `/wp-json/wc/v3/*`
   - `/wp-json/wp/v2/*`

## Step 2: Create ACF Fields for Products

### 2.1 Create ACF Field Group

1. Go to **Custom Fields → Add New**
2. Name it: **Product Details**
3. Set Location Rules:
   - **Post Type** is equal to **Product**

### 2.2 Add These Fields

✅ **Your current setup is already correct!** You have:

#### Field 1: Subheading
- **Field Label**: Subheading
- **Field Name**: `product_subheading`
- **Field Type**: Text
- **Purpose**: Product subtitle/tagline

#### Field 2: Badges
- **Field Label**: Badges
- **Field Name**: `product_badges`
- **Field Type**: Checkbox
- **Purpose**: Product badges (Vegan, Cruelty-free, etc.)
- **Choices**: Add your badge options (e.g., "Vegan", "Cruelty-free", "18+", "15ml")

#### Field 3: Benefits
- **Field Label**: Benefits
- **Field Name**: `benefits`
- **Field Type**: WYSIWYG Editor
- **Purpose**: Product benefits (use bullet list)

#### Field 4: Ingredients
- **Field Label**: Ingredients
- **Field Name**: `ingredients`
- **Field Type**: WYSIWYG Editor
- **Purpose**: Product ingredients (use bullet list)

#### Field 5: FAQs
- **Field Label**: FAQs
- **Field Name**: `product_faqs`
- **Field Type**: Repeater
- **Sub Fields**:
  - **Field Label**: Question
  - **Field Name**: `question`
  - **Field Type**: Text
  - **Field Label**: Answer
  - **Field Name**: `answer`
  - **Field Type**: Textarea

### 2.3 Enable ACF in REST API

Add this to your WordPress theme's `functions.php`:

```php
// Enable ACF fields in WooCommerce REST API
add_filter('woocommerce_rest_prepare_product_object', function($response, $product, $request) {
    $product_id = $product->get_id();
    
    // Get all ACF fields for this product
    $acf_fields = get_fields($product_id);
    
    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }
    
    return $response;
}, 10, 3);
```

## Step 3: Configure Next.js Environment

### 3.1 Update `.env.local`

Add these variables to your `.env.local` file:

```env
# WordPress API Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
WORDPRESS_API_USERNAME=ck_your_consumer_key_here
WORDPRESS_API_PASSWORD=cs_your_consumer_secret_here

# Authentication (already configured)
JWT_SECRET=your_jwt_secret_here
WORDPRESS_USERNAME=your_wp_admin_username
WORDPRESS_PASSWORD=your_wp_application_password
```

**Important**: 
- `WORDPRESS_API_USERNAME` = WooCommerce Consumer Key (starts with `ck_`)
- `WORDPRESS_API_PASSWORD` = WooCommerce Consumer Secret (starts with `cs_`)
- `WORDPRESS_USERNAME` = Your WordPress admin username (for user authentication)
- `WORDPRESS_PASSWORD` = WordPress Application Password (for user authentication)

## Step 4: Add Products to WordPress

### 4.1 Create/Edit Products in WooCommerce

1. Go to **Products → Add New** (or edit existing)
2. Fill in standard WooCommerce fields:
   - Product name
   - Short description
   - Description
   - Regular price
   - Product image
   - Categories

### 4.2 Fill in ACF Fields

Scroll down to the **Product Fields** section and fill in:

**Subheading Example**:
```
Wellness Oil with THCa
```

**Badges** (Checkbox - select applicable):
- ☑ Vegan
- ☑ Cruelty-free
- ☑ 18+
- ☑ 15ml

**Ingredients** (WYSIWYG Editor - use bullet list):
```
• Glycerin base
• THCa extract
• Alkaloids
• Flavonoids
• Terpenes
• No artificial additives
```

**Benefits** (WYSIWYG Editor - use bullet list):
```
• Non-psychoactive botanical infusion
• May assist with sense of calm
• Supports everyday balance
• Clean, minimal formulation
```

**FAQs** (Repeater - add rows):
- Row 1:
  - Question: `Is this product psychoactive?`
  - Answer: `No, this product is non-psychoactive and does not produce a "high".`
- Row 2:
  - Question: `How should I use it?`
  - Answer: `Use as directed on the label. Start with a small amount and adjust to your preference.`

## Step 5: Test the Integration

### 5.1 Test API Endpoint

Open your browser and navigate to:
```
http://localhost:3000/api/products
```

You should see a JSON response with all your products including ACF fields.

### 5.2 Test Single Product

Navigate to:
```
http://localhost:3000/api/products?slug=your-product-slug
```

Replace `your-product-slug` with an actual product slug from WordPress.

### 5.3 Test Product Page

Navigate to:
```
http://localhost:3000/products/your-product-slug
```

The product page should load with all data from WordPress.

## Step 6: Migrate Existing Products

Your existing hardcoded product pages are in:
- `/app/products/cannafusion/page.tsx`
- `/app/products/beautanicals/botaani-serum/page.tsx`
- `/app/products/beautanicals/botaani-face/page.tsx`
- `/app/products/beautanicals/botaani-body/page.tsx`

### Option A: Use Dynamic Route (Recommended)

Products will automatically load from WordPress using the new dynamic route:
- `/app/products/[slug]/page.tsx`

Just ensure your WordPress product slugs match:
- `cannafusion` → `/products/cannafusion`
- `botaani-serum` → `/products/botaani-serum`
- `botaani-face` → `/products/botaani-face`
- `botaani-body` → `/products/botaani-body`

### Option B: Keep Static Pages as Fallback

You can keep the existing pages as fallbacks. Next.js will prioritize specific routes over dynamic ones.

## Troubleshooting

### ACF Fields Not Showing

1. **Check ACF is in REST API**: Add the code from Step 2.3 to `functions.php`
2. **Verify field names**: Field names must match exactly (case-sensitive)
3. **Check product has data**: Edit product in WordPress and ensure ACF fields are filled
4. **Clear cache**: Clear WordPress cache if using a caching plugin

### Authentication Errors

1. **Verify credentials**: Double-check Consumer Key and Secret
2. **Check permissions**: API key must have Read/Write permissions
3. **Whitelist in Wordfence**: Add REST API paths to whitelist

### Products Not Loading

1. **Check WordPress URL**: Ensure `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
2. **Test WordPress API**: Visit `https://your-site.com/wp-json/wc/v3/products` in browser
3. **Check console**: Look for errors in browser console and terminal
4. **Verify product status**: Products must be "Published" in WordPress

## ACF Field Structure Reference

Your WordPress ACF fields return this structure:

```json
{
  "acf": {
    "product_subheading": "Wellness Oil with THCa",
    "product_badges": ["Vegan", "Cruelty-free", "18+", "15ml"],
    "ingredients": "<ul><li>Glycerin base</li><li>THCa extract</li></ul>",
    "benefits": "<ul><li>Non-psychoactive</li><li>May assist with calm</li></ul>",
    "product_faqs": [
      {
        "question": "Is this safe?",
        "answer": "Yes, when used as directed."
      }
    ]
  }
}
```

The code automatically transforms:
- **WYSIWYG fields** (ingredients, benefits) → Arrays of strings
- **Checkbox field** (product_badges) → Array of selected values
- **Repeater field** (product_faqs) → Array of objects with question/answer

## Next Steps

1. ✅ Configure `.env.local` with WordPress credentials
2. ✅ Create ACF fields in WordPress
3. ✅ Add products to WooCommerce
4. ✅ Fill in ACF fields for each product
5. ✅ Test API endpoints
6. ✅ Update product slugs to match WordPress
7. ✅ Remove hardcoded product data (optional)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check terminal/server logs
3. Verify WordPress REST API is accessible
4. Test WooCommerce API with Postman
5. Ensure ACF Pro is activated and licensed
