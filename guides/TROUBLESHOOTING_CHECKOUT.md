# Troubleshooting Checkout Errors

## Error: "There has been a critical error on this website"

This WordPress error page means there's a PHP error on the WordPress side.

### ✅ Confirmed Working
The test script (`node test-create-order.js`) successfully created order #832, which means:
- ✅ WooCommerce API credentials are correct
- ✅ WooCommerce REST API is working
- ✅ Order creation endpoint is functional
- ✅ Product ID 94 (Botaani Cannafusion) exists

### 🔍 Possible Causes

#### 1. WordPress Debug Mode Not Enabled
Without debug mode, WordPress shows generic error pages.

**Fix**: Enable WordPress debugging to see actual errors.

Add to `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

Then check `wp-content/debug.log` for errors.

#### 2. Cart Product IDs Are Strings
Your cart stores product IDs as strings (e.g., `"botaani-cannafusion"`), but WooCommerce needs integers (e.g., `94`).

**Check your cart**:
```javascript
// In browser console
console.log(localStorage.getItem('botaani-cart'));
```

Expected format:
```json
[{
  "id": "94",
  "name": "Botaani Cannafusion",
  "price": 1500,
  "quantity": 1
}]
```

**If IDs are slugs** (like `"botaani-cannafusion"`), you need to:
1. Fetch product by slug first
2. Get the numeric ID
3. Use that for the order

#### 3. Missing Required Fields
WooCommerce might require additional fields that aren't being sent.

**Test with minimal data**:
```javascript
// Add console.log in checkout page before API call
console.log('Sending order data:', {
  billing: formData.billingEmail,
  line_items: cartItems.map(item => ({
    id: item.id,
    parsed: parseInt(item.id),
    isValid: !isNaN(parseInt(item.id))
  }))
});
```

#### 4. CORS or Server Configuration
WP Engine might have specific security rules.

**Check**:
- Is your Next.js site on a different domain?
- Are there any firewall rules blocking API requests?

### 🛠️ Debugging Steps

#### Step 1: Check Cart Contents
Open browser console on your site:
```javascript
// Check what's in the cart
const cart = JSON.parse(localStorage.getItem('botaani-cart') || '[]');
console.log('Cart items:', cart);

// Check if IDs are valid numbers
cart.forEach(item => {
  console.log(`${item.name}: ID="${item.id}", Parsed=${parseInt(item.id)}, Valid=${!isNaN(parseInt(item.id))}`);
});
```

#### Step 2: Check Network Request
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to checkout
4. Find the `/api/orders/create` request
5. Check the Request Payload

Should look like:
```json
{
  "billing": { ... },
  "shipping": { ... },
  "line_items": [
    {
      "product_id": 94,
      "quantity": 1
    }
  ]
}
```

#### Step 3: Check Server Logs
Look at your Next.js terminal output when you submit the checkout form. You should see:
```
Creating WooCommerce order: { billing: 'test@example.com', items: 1 }
```

If you see an error there, it will tell you what's wrong.

#### Step 4: Enable WordPress Debug
SSH into your WordPress server or use cPanel File Manager:

1. Edit `wp-config.php`
2. Add before `/* That's all, stop editing! */`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', 0 );
```
3. Save and try checkout again
4. Check `wp-content/debug.log`

### 🔧 Quick Fixes

#### Fix 1: Update Product Template to Use Numeric IDs
If your products are being added to cart with slug IDs, update the product template:

```typescript
// In product-template.tsx
const handleAddToCart = () => {
  addToCart({
    id: String(product.id), // Use numeric ID, not slug
    name: title,
    price,
    quantity,
    image
  });
};
```

#### Fix 2: Add Product ID Mapping
Create a helper to map slugs to IDs:

```typescript
// lib/product-ids.ts
export const PRODUCT_IDS: Record<string, number> = {
  'botaani-cannafusion': 94,
  'botaani-serum': 810,
  'botaani-face': 816,
  'botaani-body': 817
};

export function getProductId(idOrSlug: string): number {
  const parsed = parseInt(idOrSlug);
  if (!isNaN(parsed)) return parsed;
  return PRODUCT_IDS[idOrSlug] || 0;
}
```

Then use in checkout:
```typescript
line_items: cartItems.map(item => ({
  product_id: getProductId(item.id),
  quantity: item.quantity
}))
```

### 📋 Checklist

Before contacting support, verify:

- [ ] Test script works: `node test-create-order.js`
- [ ] Cart contains valid product IDs (numbers, not slugs)
- [ ] WordPress debug mode is enabled
- [ ] Checked `wp-content/debug.log` for errors
- [ ] Checked browser console for JavaScript errors
- [ ] Checked Network tab for API request/response
- [ ] WooCommerce is active and configured
- [ ] PayFast gateway is enabled in WooCommerce

### 🆘 Still Not Working?

1. **Check the actual cart data**:
   ```bash
   # In your browser console
   localStorage.getItem('botaani-cart')
   ```

2. **Try creating order manually**:
   ```bash
   node test-create-order.js
   ```
   If this works, the issue is in the Next.js checkout flow.

3. **Check WordPress error logs** on WP Engine:
   - Log into WP Engine dashboard
   - Go to your site
   - Check error logs

4. **Contact WP Engine support** if you see PHP errors in logs

### 📞 What to Tell Support

If you need to contact support, provide:
1. The exact error message from `wp-content/debug.log`
2. The request payload from browser DevTools
3. Confirmation that `node test-create-order.js` works
4. Your WooCommerce version
5. Your PHP version
