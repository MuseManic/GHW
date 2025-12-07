# PayFast Integration Troubleshooting

## "Payment session expired" Error

This error means the payment data wasn't found in sessionStorage. Here's how to fix it:

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try checkout again
4. Look for these messages:

```
Payment data received: {...}
Stored in sessionStorage: payment_123 true
Payment process page loaded, orderId: 123
Looking for sessionStorage key: payment_123
SessionStorage data found: true
```

### Step 2: Check Environment Variables

Make sure these are in your `.env.local`:

```env
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**: Restart your dev server after adding env variables!

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Check API Response

In browser console, look for:
```
Initiating PayFast payment: {...}
PayFast config: { merchantId: '10000100', ... }
```

If you see:
```
PayFast credentials missing!
```

Then your `.env.local` is not configured correctly.

### Step 4: Verify SessionStorage

In browser console, run:
```javascript
// Check what's in sessionStorage
console.log(Object.keys(sessionStorage));
console.log(sessionStorage.getItem('payment_123')); // Replace 123 with your order ID
```

## Common Issues

### Issue 1: Environment Variables Not Loading

**Symptom**: Console shows "PayFast credentials missing"

**Fix**:
1. Check `.env.local` exists in project root
2. Variables start with `PAYFAST_` (not `NEXT_PUBLIC_PAYFAST_`)
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Issue 2: SessionStorage Cleared Too Early

**Symptom**: Data stored but not found on next page

**Fix**: Already fixed in latest code - now using `window.location.href` instead of `router.push()`

### Issue 3: Order Created But Payment Fails

**Symptom**: Order appears in WooCommerce but payment doesn't initiate

**Check**:
1. Browser console for errors
2. Terminal for API errors
3. PayFast credentials are correct

### Issue 4: "Failed to initiate payment"

**Symptom**: Alert shows after clicking "Place Order"

**Check**:
1. `.env.local` has all PayFast variables
2. Dev server was restarted after adding variables
3. Check terminal for error details

## Debug Checklist

Run through this checklist:

- [ ] `.env.local` file exists in project root
- [ ] All PayFast variables are set (MERCHANT_ID, MERCHANT_KEY, PASSPHRASE, SANDBOX)
- [ ] Dev server restarted after adding variables
- [ ] Browser console shows "Payment data received"
- [ ] Browser console shows "Stored in sessionStorage: payment_XXX true"
- [ ] No errors in browser console
- [ ] No errors in terminal

## Testing Flow

1. **Add product to cart**
2. **Go to checkout**
3. **Open browser console (F12)**
4. **Fill in form and submit**
5. **Watch console for messages**:
   - "Creating WooCommerce order"
   - "Order created successfully"
   - "Initiating PayFast payment"
   - "Payment data received"
   - "Stored in sessionStorage"
   - "Payment process page loaded"
   - "SessionStorage data found: true"

If any of these are missing, that's where the issue is!

## Still Not Working?

### Check Terminal Output

Look for:
```
POST /api/orders/create 200 in 2.5s
POST /api/payfast/initiate 200 in 50ms
```

If you see `500` errors, check the error details in terminal.

### Check Network Tab

1. Open DevTools → Network tab
2. Try checkout
3. Look for:
   - `/api/orders/create` - Should be 200
   - `/api/payfast/initiate` - Should be 200

Click on each request to see the response.

### Manual Test

Try this in browser console:
```javascript
// Test PayFast API directly
fetch('/api/payfast/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: '999',
    amount: 100,
    itemName: 'Test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  })
})
.then(r => r.json())
.then(console.log);
```

Should return:
```json
{
  "success": true,
  "paymentData": {...},
  "signature": "...",
  "processUrl": "https://sandbox.payfast.co.za/eng/process"
}
```

## Quick Fix

If nothing works, try this:

1. **Delete `.env.local`**
2. **Create new `.env.local`** with:
```env
# WordPress/WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://botaanidev.wpengine.com/za/
NEXT_PUBLIC_WORDPRESS_API_URL=https://botaanidev.wpengine.com/za/wp-json
WORDPRESS_API_USERNAME=ck_178770bd9153327002d75daf4bad19cc4a95e9e9
WORDPRESS_API_PASSWORD=cs_320ec69dd9af49c8696043ba0379429fcad5b7d5

# Authentication
WORDPRESS_USERNAME=corbettc
WORDPRESS_PASSWORD='PUub Wr9d de2x DJFw i0Al mLx1'
JWT_SECRET='vGiE8HQf^l-y+RVWve{Q]fA}]N2V]CcrwR+QQC.*z;@XobHQX0q&w@@CeP6@9oKI'

# PayFast Sandbox
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=jt7NOE43FZPn
PAYFAST_SANDBOX=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Restart server**: `Ctrl+C` then `npm run dev`
4. **Clear browser cache**: Ctrl+Shift+Delete
5. **Try again**

## Contact Support

If still not working, provide:
1. Screenshot of browser console
2. Screenshot of terminal errors
3. Your `.env.local` (hide sensitive values)
