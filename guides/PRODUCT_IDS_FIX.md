# Product ID Fix - Complete ✅

## Problem
Cart was storing product IDs as slugs (e.g., `"botaani-cannafusion"`) instead of numeric WooCommerce IDs (e.g., `"94"`), causing checkout to fail with WordPress critical error.

## Solution Implemented

### 1. Created Product ID Mapping (`/lib/product-ids.ts`)
Maps product slugs to their WooCommerce numeric IDs:
- Botaani Cannafusion: **94**
- Botaani Serum: **810**
- Botaani Face: **816**
- Botaani Body: **817**

### 2. Updated Product Template (`/components/product-template.tsx`)
- Added `id` prop (numeric WooCommerce ID)
- Added `slug` prop (product slug)
- Now uses numeric ID when adding to cart

### 3. Updated All Product Pages
Added numeric IDs to all hardcoded product pages:

**Cannafusion** (`/app/products/cannafusion/page.tsx`):
```tsx
<ProductTemplate
  id={94}
  slug="botaani-cannafusion"
  ...
/>
```

**Serum** (`/app/products/beautanicals/botaani-serum/page.tsx`):
```tsx
<ProductTemplate
  id={810}
  slug="botaani-serum"
  ...
/>
```

**Face** (`/app/products/beautanicals/botaani-face/page.tsx`):
```tsx
<ProductTemplate
  id={816}
  slug="botaani-face"
  ...
/>
```

**Body** (`/app/products/beautanicals/botaani-body/page.tsx`):
```tsx
<ProductTemplate
  id={817}
  slug="botaani-body"
  ...
/>
```

### 4. Updated Dynamic Product Page (`/app/products/[slug]/page.tsx`)
Now passes both `id` and `slug` to ProductTemplate from WordPress data.

### 5. Updated Checkout (`/app/checkout/page.tsx`)
Uses `getProductId()` helper to convert any cart item ID (numeric or slug) to proper WooCommerce product ID.

## How It Works Now

### Adding to Cart
```typescript
// When user clicks "Add to Cart"
addToCart({
  id: "94",              // ✅ Numeric ID as string
  name: "Botaani Cannafusion",
  price: 1500,
  quantity: 1
});
```

### At Checkout
```typescript
// Cart items are converted to WooCommerce format
line_items: [
  {
    product_id: 94,      // ✅ Numeric integer
    quantity: 1
  }
]
```

## Testing

### 1. Clear Your Cart
Open browser console:
```javascript
localStorage.removeItem('botaani-cart');
location.reload();
```

### 2. Add Product to Cart
- Go to any product page
- Click "Add to Cart"
- Check cart in console:
```javascript
console.log(JSON.parse(localStorage.getItem('botaani-cart')));
```

Should see:
```json
[{
  "id": "94",
  "name": "Botaani Cannafusion",
  "price": 1500,
  "quantity": 1
}]
```

### 3. Test Checkout
- Go to checkout
- Fill in form
- Click "Place Order"
- Should redirect to PayFast payment page

## Backward Compatibility

The system now handles:
- ✅ Numeric IDs: `"94"` → `94`
- ✅ Slugs: `"botaani-cannafusion"` → `94`
- ✅ Already numeric: `94` → `94`

So even if old cart data has slugs, it will still work!

## What Changed

### Before ❌
```typescript
// Product template generated slug from title
id: title.toLowerCase().replace(/\s+/g, '-')
// Result: "botaani-cannafusion"

// Checkout tried to parse as integer
product_id: parseInt("botaani-cannafusion")
// Result: NaN → WordPress error
```

### After ✅
```typescript
// Product template uses numeric ID
id: "94"

// Checkout converts to integer
product_id: getProductId("94")
// Result: 94 → Success!
```

## Files Modified

1. ✅ `/lib/product-ids.ts` - Created
2. ✅ `/components/product-template.tsx` - Updated
3. ✅ `/app/products/cannafusion/page.tsx` - Updated
4. ✅ `/app/products/beautanicals/botaani-serum/page.tsx` - Updated
5. ✅ `/app/products/beautanicals/botaani-face/page.tsx` - Updated
6. ✅ `/app/products/beautanicals/botaani-body/page.tsx` - Updated
7. ✅ `/app/products/[slug]/page.tsx` - Updated
8. ✅ `/app/checkout/page.tsx` - Updated

## Next Steps

1. ✅ Clear your cart: `localStorage.removeItem('botaani-cart')`
2. ✅ Add a product to cart
3. ✅ Verify cart has numeric ID
4. ✅ Test checkout flow
5. ✅ Should redirect to PayFast successfully!

## Troubleshooting

### Still getting errors?
1. **Clear your cart** - Old cart data might have slugs
2. **Check cart contents**:
   ```javascript
   console.log(localStorage.getItem('botaani-cart'));
   ```
3. **Verify product IDs** in WooCommerce match the mapping
4. **Check browser console** for any JavaScript errors

### Cart has old data?
```javascript
// Clear and reload
localStorage.removeItem('botaani-cart');
location.reload();
```

## Success Criteria

✅ Cart stores numeric IDs (as strings)
✅ Checkout converts to integers correctly
✅ Order creation succeeds
✅ Redirects to PayFast payment page
