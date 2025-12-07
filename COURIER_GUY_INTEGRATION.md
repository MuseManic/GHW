# The Courier Guy Integration - Complete Guide

## Overview

The Courier Guy shipping is now integrated with your Next.js checkout! Shipping rates are calculated automatically based on the customer's address and displayed during checkout.

## How It Works

```
User enters shipping address
         ↓
Address triggers shipping calculation
         ↓
API fetches rates from WooCommerce
         ↓
WooCommerce queries The Courier Guy
         ↓
Shipping options displayed
         ↓
User selects shipping method
         ↓
Shipping cost added to order
```

## Files Created/Modified

### API Routes
- `/app/api/shipping/calculate/route.ts` - Calculates shipping rates from WooCommerce

### Pages
- `/app/checkout/page.tsx` - Updated with shipping method selection

## WordPress Setup Required

### 1. Install The Courier Guy Plugin

You already have this installed! ✅

### 2. Configure The Courier Guy

1. **Go to**: WooCommerce → Settings → Shipping
2. **Click on**: The Courier Guy
3. **Configure**:
   - API Username
   - API Password
   - Service Type (Overnight, Economy, etc.)
   - Collection Address
   - Packaging options

### 3. Set Up Shipping Zones

1. **Go to**: WooCommerce → Settings → Shipping → Shipping Zones
2. **Add Zone**: "South Africa"
3. **Add Regions**: South Africa (or specific provinces)
4. **Add Shipping Method**: The Courier Guy
5. **Configure** rates and options

### 4. Test Shipping Calculation

1. Go to WooCommerce → Settings → Shipping
2. Use the "Shipping Calculator" to test rates
3. Enter a test address and see if rates are returned

## How It Works in Your App

### 1. Address Entry

When user fills in shipping address (city, province, postal code), the app automatically calculates shipping rates.

### 2. Shipping Calculation

The app sends a request to `/api/shipping/calculate` with:
- Country: ZA (South Africa)
- State/Province
- City
- Postal Code
- Cart items (for weight/dimensions)

### 3. Display Options

Available shipping methods are displayed as radio buttons with:
- Method name (e.g., "The Courier Guy - Overnight")
- Description
- Cost

### 4. Order Creation

Selected shipping method is included in the WooCommerce order:
```javascript
shipping_lines: [{
  method_id: "the_courier_guy",
  method_title: "The Courier Guy - Overnight",
  total: "150.00"
}]
```

## Features

✅ **Automatic Calculation**: Rates calculated as user types address
✅ **Multiple Options**: Shows all available shipping methods
✅ **Real-time Rates**: Fetches live rates from The Courier Guy API
✅ **Visual Selection**: Clean UI for choosing shipping method
✅ **Order Integration**: Shipping automatically added to WooCommerce order

## Testing

### 1. Test Address

Use a real South African address:
```
City: Cape Town
Province: Western Cape
Postal Code: 8001
```

### 2. Expected Behavior

1. Enter billing address
2. Check "Same as billing" or enter shipping address
3. Shipping methods appear automatically
4. Select a shipping method
5. Cost is included in order total
6. Complete checkout

### 3. Check WooCommerce

After order creation:
1. Go to WooCommerce → Orders
2. Open the order
3. Check "Shipping" section
4. Should show selected method and cost

## Troubleshooting

### No Shipping Methods Appear

**Check**:
1. The Courier Guy plugin is active
2. Shipping zones are configured
3. The Courier Guy is added to the zone
4. API credentials are correct
5. Address matches a shipping zone

**Debug**:
```javascript
// In browser console
fetch('/api/shipping/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    country: 'ZA',
    state: 'WC',
    city: 'Cape Town',
    postcode: '8001',
    items: [{ product_id: 94, quantity: 1 }]
  })
})
.then(r => r.json())
.then(console.log);
```

### "Calculating shipping rates..." Never Finishes

**Possible causes**:
1. WooCommerce API credentials incorrect
2. The Courier Guy API not responding
3. No matching shipping zone

**Check terminal** for error messages.

### Shipping Cost Not Added to Order

**Check**:
1. Shipping method is selected before checkout
2. `selectedShipping` state has a value
3. Order creation includes `shipping_lines`

## Customization

### Change Shipping Display

Edit `/app/checkout/page.tsx` around line 620:

```tsx
<div className="font-semibold text-gray-900">{method.title}</div>
```

### Add Estimated Delivery

The Courier Guy API returns delivery estimates. To display them, update the shipping calculation API to include delivery time.

### Filter Shipping Methods

In `/app/api/shipping/calculate/route.ts`, filter methods:

```typescript
const shippingMethods = methodsResponse.data
  .filter((method: any) => 
    method.enabled && 
    method.method_id === 'the_courier_guy' // Only show Courier Guy
  )
  .map(...)
```

## Production Checklist

- [ ] The Courier Guy plugin configured with live API credentials
- [ ] Shipping zones set up for all delivery areas
- [ ] Test orders with real addresses
- [ ] Verify shipping costs are correct
- [ ] Check order tracking integration
- [ ] Test with different product weights/sizes

## Support

- [The Courier Guy Plugin Documentation](https://www.thecourierguy.co.za/woocommerce/)
- [WooCommerce Shipping Zones](https://woocommerce.com/document/setting-up-shipping-zones/)
- [The Courier Guy API](https://www.thecourierguy.co.za/api/)

## Next Steps

1. ✅ Configure The Courier Guy plugin in WordPress
2. ✅ Set up shipping zones
3. ✅ Test with real addresses
4. ✅ Verify orders in WooCommerce
5. ✅ Go live!
