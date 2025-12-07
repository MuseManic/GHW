# Quick Start - WooCommerce Integration

## Your Current Setup ✅

You already have:
- ✅ 5 products in WooCommerce (Botaani Cannafusion, Serum, Face, Body)
- ✅ ACF field group "Product Fields" with 5 fields
- ✅ Code updated to match your ACF structure

## What You Need to Do

### 1. Add Code to WordPress `functions.php`

Add this code to expose ACF fields in the REST API:

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

### 2. Generate WooCommerce API Keys

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set:
   - Description: "Next.js Frontend"
   - User: Select admin user
   - Permissions: **Read/Write**
4. Click **Generate API Key**
5. **Copy both keys** (you'll need them next)

### 3. Update `.env.local`

Add these to your `.env.local` file:

```env
# WordPress WooCommerce API
NEXT_PUBLIC_WORDPRESS_API_URL=https://botaani.co.za/wp-json
WORDPRESS_API_USERNAME=ck_your_consumer_key_here
WORDPRESS_API_PASSWORD=cs_your_consumer_secret_here

# WordPress Authentication (already configured)
WORDPRESS_USERNAME=your_wp_admin_username
WORDPRESS_PASSWORD=your_application_password
JWT_SECRET=your_jwt_secret_here
```

### 4. Fill in ACF Fields for Your Products

Edit each product in WordPress and fill in the **Product Fields**:

#### For Botaani Cannafusion:
- **Subheading**: `Wellness Oil with THCa`
- **Badges**: Check `Vegan`, `18+`, `15ml`
- **Ingredients**: Use bullet list in WYSIWYG editor
- **Benefits**: Use bullet list in WYSIWYG editor
- **FAQs**: Add rows with questions and answers

#### For Botaani Serum:
- **Subheading**: `Lightweight Restorative Oil`
- **Badges**: Check `Vegan`, `Cruelty-free`, `20ml`
- **Ingredients**: List ingredients
- **Benefits**: List benefits
- **FAQs**: Add common questions

#### For Botaani Face:
- **Subheading**: Your product tagline
- **Badges**: Select applicable badges
- **Ingredients**: List ingredients
- **Benefits**: List benefits
- **FAQs**: Add FAQs

#### For Botaani Body:
- **Subheading**: Your product tagline
- **Badges**: Select applicable badges
- **Ingredients**: List ingredients
- **Benefits**: List benefits
- **FAQs**: Add FAQs

### 5. Check Product Slugs

Your products need these slugs in WordPress:
- `botaani-cannafusion` or `cannafusion`
- `botaani-serum`
- `botaani-face`
- `botaani-body`

To check/update slugs:
1. Edit product in WordPress
2. Look at the permalink (URL)
3. Click "Edit" next to permalink to change slug if needed

### 6. Test the Integration

#### Test API:
```
http://localhost:3000/api/products
```

#### Test Single Product:
```
http://localhost:3000/api/products?slug=botaani-cannafusion
```

#### Test Product Page:
```
http://localhost:3000/products/botaani-cannafusion
```

## Your Product URLs

Once configured, your products will be available at:
- `/products/cannafusion` (or `/products/botaani-cannafusion`)
- `/products/botaani-serum`
- `/products/botaani-face`
- `/products/botaani-body`

## How to Format ACF Fields

### Ingredients & Benefits (WYSIWYG Editor)

Use the bullet list button in the editor:
```
• Glycerin base
• THCa extract
• Alkaloids
• Flavonoids
```

Or use the numbered list for ordered items.

### Badges (Checkbox)

First, make sure your checkbox field has choices:
1. Edit the "Badges" field in ACF
2. Add choices:
   ```
   vegan : Vegan
   cruelty-free : Cruelty-free
   18+ : 18+
   15ml : 15ml
   20ml : 20ml
   ```
3. Then just check the boxes when editing products

### FAQs (Repeater)

Click "Add Row" for each FAQ:
- **Question**: Type the question
- **Answer**: Type the answer (can be multiple paragraphs)

## Troubleshooting

### "Product not found" error
- Check product slug matches URL
- Ensure product is "Published" in WordPress
- Verify `.env.local` has correct WordPress URL

### ACF fields not showing
- Add the code to `functions.php` (Step 1)
- Clear WordPress cache if using caching plugin
- Check that ACF fields are filled in for the product

### Authentication errors
- Verify WooCommerce API keys are correct
- Check that API key has Read/Write permissions
- Ensure WordPress URL includes `/wp-json`

## Next Steps After Setup

1. Test all product pages load correctly
2. Verify ACF data displays properly
3. Update product images if needed
4. Add more products as needed
5. Consider removing old hardcoded product pages

## Need Help?

Check the full documentation: `WOOCOMMERCE_ACF_SETUP.md`
