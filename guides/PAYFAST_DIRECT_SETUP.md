# PayFast Direct Integration - Setup Guide

## Overview

PayFast is now integrated directly into your Next.js app! No more redirecting to WordPress. Users stay on your site throughout the checkout process.

## How It Works

```
User fills checkout form
         ↓
Order created in WooCommerce
         ↓
PayFast payment initiated (in your app)
         ↓
User redirected to PayFast payment page
         ↓
Payment processed
         ↓
User returns to YOUR success page
         ↓
PayFast sends IPN to your API
         ↓
Order status updated in WooCommerce
```

## Setup Steps

### 1. Get PayFast Credentials

#### For Testing (Sandbox):
1. Go to [PayFast Sandbox](https://sandbox.payfast.co.za/)
2. Create a test account
3. Get your credentials:
   - Merchant ID: `10000100`
   - Merchant Key: `46f0cd694581a`
   - Passphrase: (create one in settings)

#### For Production:
1. Go to [PayFast](https://www.payfast.co.za/)
2. Sign up for a merchant account
3. Get verified
4. Get your live credentials from Settings

### 2. Add Environment Variables

Add these to your `.env.local` file:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_passphrase_here
PAYFAST_SANDBOX=true

# Base URL (change for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Production**, change:
```env
PAYFAST_SANDBOX=false
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Configure PayFast URLs

Log into PayFast dashboard and set these URLs:

**Return URL**: `https://yourdomain.com/payment/success`
**Cancel URL**: `https://yourdomain.com/payment/cancel`
**Notify URL**: `https://yourdomain.com/api/payfast/notify`

⚠️ **Important**: For local testing, PayFast IPN won't work (they can't reach localhost). You'll need to:
- Deploy to a public URL, OR
- Use a tunnel service like ngrok

### 4. Test the Integration

#### Test with Sandbox:

1. Add products to cart
2. Go to checkout
3. Fill in form
4. Click "Place Order"
5. You'll be redirected to PayFast sandbox
6. Use test card details:
   - Card Number: Any valid format (e.g., `4000 0000 0000 0002`)
   - Expiry: Any future date
   - CVV: Any 3 digits

7. Complete payment
8. You'll return to your success page

## Files Created

### API Routes
- `/app/api/payfast/initiate/route.ts` - Initiates payment
- `/app/api/payfast/notify/route.ts` - Handles IPN from PayFast

### Pages
- `/app/payment/process/page.tsx` - Payment processing page
- `/app/payment/success/page.tsx` - Payment success page
- `/app/payment/cancel/page.tsx` - Payment cancelled page

### Components
- `/components/payfast-form.tsx` - PayFast payment form

### Utilities
- `/lib/payfast.ts` - PayFast signature generation and utilities

## Payment Flow Details

### 1. Checkout Submission
When user clicks "Place Order":
1. Order created in WooCommerce
2. PayFast payment initiated
3. Payment data stored in sessionStorage
4. User redirected to `/payment/process`

### 2. Payment Processing
On `/payment/process`:
1. Payment data retrieved from sessionStorage
2. PayFast form auto-submitted
3. User redirected to PayFast

### 3. Payment at PayFast
User completes payment on PayFast's secure page.

### 4. Return to Site
After payment:
- **Success**: Redirected to `/payment/success`
- **Cancel**: Redirected to `/payment/cancel`

### 5. IPN (Background)
PayFast sends IPN to `/api/payfast/notify`:
1. Signature verified
2. Payment validated with PayFast
3. Order status updated in WooCommerce

## Security Features

✅ **Signature Verification**: All PayFast data is cryptographically verified
✅ **Server Validation**: Payment validated with PayFast servers
✅ **Secure Storage**: Payment data in sessionStorage (cleared after use)
✅ **HTTPS Required**: Production requires HTTPS

## Testing Checklist

- [ ] Environment variables configured
- [ ] Sandbox mode enabled
- [ ] Can create order
- [ ] Redirects to PayFast sandbox
- [ ] Can complete test payment
- [ ] Returns to success page
- [ ] Order status updates in WooCommerce (requires public URL)

## Troubleshooting

### "Failed to initiate payment"
- Check PayFast credentials in `.env.local`
- Verify `PAYFAST_MERCHANT_ID` and `PAYFAST_MERCHANT_KEY`
- Check console for errors

### "Payment session expired"
- Payment data cleared from sessionStorage
- User needs to checkout again

### IPN not working
- **Local development**: IPN won't work (PayFast can't reach localhost)
- **Solution**: Deploy to public URL or use ngrok
- **Check**: PayFast notify URL is correct

### Order status not updating
- Check IPN handler logs in terminal
- Verify WooCommerce API credentials
- Check PayFast IPN logs in dashboard

## Production Deployment

Before going live:

1. **Get live PayFast credentials**
2. **Update `.env.local`**:
   ```env
   PAYFAST_SANDBOX=false
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
3. **Configure PayFast URLs** in dashboard
4. **Test with real card** (small amount)
5. **Verify IPN working**
6. **Check order updates in WooCommerce**

## Advantages Over WordPress Redirect

✅ **Better UX**: Users stay on your site
✅ **Consistent branding**: No jarring redirect to WordPress
✅ **More control**: Custom success/cancel pages
✅ **Faster**: No WordPress page load
✅ **Cleaner**: No WordPress theme/plugins loaded

## Support

- [PayFast Documentation](https://developers.payfast.co.za/)
- [PayFast Sandbox](https://sandbox.payfast.co.za/)
- [PayFast Support](https://www.payfast.co.za/support/)
