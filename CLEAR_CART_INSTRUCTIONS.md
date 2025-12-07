# Clear Your Cart - Important! 🛒

## Why You Need to Clear Your Cart

Your cart currently has products with old IDs (like `"serum"`) that don't match the WooCommerce product IDs. This will cause checkout to fail.

## Quick Fix (2 steps)

### Step 1: Open Browser Console
1. Press **F12** (or right-click → Inspect)
2. Click the **Console** tab

### Step 2: Run This Command
Copy and paste this into the console:

```javascript
localStorage.removeItem('botaani-cart');
location.reload();
```

Press **Enter**.

## That's It! ✅

Your cart is now cleared and the page will reload. Now:

1. ✅ Add products to cart again
2. ✅ Products will have correct IDs (94, 810, 816, 817)
3. ✅ Checkout will work!

## What Changed?

### Before ❌
```json
{
  "id": "serum",  // Wrong!
  "name": "Botaani Serum",
  "price": 799
}
```

### After ✅
```json
{
  "id": "810",  // Correct WooCommerce ID!
  "name": "Botaani Serum",
  "price": 799
}
```

## Verify It Worked

After clearing and adding a product, check your cart:

```javascript
console.log(JSON.parse(localStorage.getItem('botaani-cart')));
```

You should see numeric IDs like `"94"`, `"810"`, `"816"`, or `"817"`.

## If You Still Get Errors

The product ID mapping now includes these variations:
- `"94"` → 94 ✅
- `"810"` → 810 ✅
- `"serum"` → 810 ✅
- `"botaani-serum"` → 810 ✅

So even if something slips through, it should still work!

## Alternative: Clear Cart via UI

If you prefer not to use console:

1. Go to your cart page
2. Remove all items manually
3. Add products again

But the console method is faster! 😊
