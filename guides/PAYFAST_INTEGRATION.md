# PayFast + WooCommerce Integration Guide

## Overview

This integration uses WooCommerce REST API to create orders and redirects to PayFast for payment processing. No need to reimplement PayFast in Next.js!

## How It Works

```
User fills checkout form
         ↓
Next.js creates order via WooCommerce API
         ↓
WooCommerce returns checkout URL
         ↓
User redirected to PayFast payment page
         ↓
PayFast processes payment
         ↓
PayFast redirects back to WordPress
         ↓
WooCommerce updates order status
         ↓
User sees order confirmation page
```

## Implementation Complete ✅

### Files Created

1. **`/app/api/orders/create/route.ts`**
   - Creates orders in WooCommerce
   - Returns PayFast checkout URL
   - Handles billing/shipping data

2. **`/app/api/orders/[orderId]/route.ts`**
   - Fetches order status from WooCommerce
   - Used for order confirmation page
   - Polls for payment updates

3. **`/app/order-confirmation/page.tsx`**
   - Displays order details
   - Auto-polls for status updates
   - Shows payment success/failure

4. **`/app/checkout/page.tsx`** (Updated)
   - Integrated with cart context
   - Creates WooCommerce order on submit
   - Redirects to PayFast checkout

## Checkout Flow

### 1. User Adds Products to Cart
```typescript
// Cart items stored in CartContext
{
  id: "94",
  name: "Botaani Cannafusion",
  price: 1500,
  quantity: 1,
  image: "/front-bottle.jpg"
}
```

### 2. User Goes to Checkout
- Must be logged in (protected route)
- Fills in billing/shipping information
- Accepts terms and age confirmation

### 3. Order Creation
```typescript
POST /api/orders/create
{
  billing: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "0821234567",
    address_1: "123 Main St",
    city: "Cape Town",
    state: "Western Cape",
    postcode: "8001",
    country: "ZA"
  },
  shipping: { ... },
  line_items: [
    { product_id: 94, quantity: 1 }
  ]
}
```

### 4. WooCommerce Response
```json
{
  "success": true,
  "order_id": 123,
  "order_key": "wc_order_abc123",
  "total": "1500.00",
  "currency": "ZAR",
  "checkout_url": "https://botaanidev.wpengine.com/za/checkout/order-pay/123/?pay_for_order=true&key=wc_order_abc123"
}
```

### 5. Redirect to PayFast
```javascript
window.location.href = data.checkout_url;
```

User is redirected to WordPress/WooCommerce checkout page where PayFast handles payment.

### 6. Payment Processing
- PayFast displays payment form
- User enters payment details
- PayFast processes payment
- PayFast sends IPN (Instant Payment Notification) to WooCommerce
- WooCommerce updates order status

### 7. Return to Site
After payment, PayFast redirects to:
- **Success**: `https://your-site.com/order-confirmation?order_id=123&key=wc_order_abc123`
- **Cancel**: `https://your-site.com/checkout` (user can try again)

## Order Status Polling

The confirmation page automatically polls for order updates:

```typescript
// Polls every 5 seconds for 2 minutes
useEffect(() => {
  const interval = setInterval(() => {
    fetchOrderStatus();
  }, 5000);
  
  setTimeout(() => clearInterval(interval), 120000);
}, []);
```

### Order Statuses

| Status | Meaning |
|--------|---------|
| `pending` | Waiting for payment |
| `processing` | Payment received, order being processed |
| `completed` | Order fulfilled |
| `failed` | Payment failed |
| `cancelled` | Order cancelled |

## WordPress Setup Required

### 1. Configure PayFast in WooCommerce

1. Go to **WooCommerce → Settings → Payments**
2. Enable **PayFast**
3. Click **Manage** and configure:
   - Merchant ID
   - Merchant Key
   - Passphrase
   - Enable Sandbox mode (for testing)

### 2. Set Return URLs

In PayFast settings, set:
- **Return URL**: `https://your-nextjs-site.com/order-confirmation`
- **Cancel URL**: `https://your-nextjs-site.com/checkout`
- **Notify URL**: `https://your-wordpress-site.com/?wc-api=WC_Gateway_PayFast` (auto-configured)

### 3. Test Mode

For testing:
1. Enable **PayFast Sandbox Mode** in WooCommerce
2. Use PayFast test credentials
3. Test card: Any valid card format (payment won't be processed)

## Environment Variables

Make sure these are set in `.env.local`:

```env
# WordPress/WooCommerce API
NEXT_PUBLIC_WORDPRESS_URL=https://botaanidev.wpengine.com/za/
NEXT_PUBLIC_WORDPRESS_API_URL=https://botaanidev.wpengine.com/za/wp-json
WORDPRESS_API_USERNAME=ck_your_consumer_key
WORDPRESS_API_PASSWORD=cs_your_consumer_secret

# User Authentication
WORDPRESS_USERNAME=your_admin_username
WORDPRESS_PASSWORD=your_application_password
JWT_SECRET=your_jwt_secret
```

## Testing the Integration

### 1. Test Order Creation

```bash
# Add products to cart
# Go to /checkout
# Fill in form
# Click "Place Order"
```

Expected:
- Order created in WooCommerce
- Redirected to PayFast payment page

### 2. Test Payment (Sandbox)

Use PayFast sandbox credentials:
- Any valid card number format
- Future expiry date
- Any CVV

### 3. Test Order Status

After payment:
- Should redirect to `/order-confirmation?order_id=123&key=wc_order_abc123`
- Page should show order details
- Status should update from "pending" to "processing"

## Troubleshooting

### Order creation fails
- Check WooCommerce API credentials
- Verify products exist in WooCommerce
- Check product IDs match

### Redirect doesn't work
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is correct
- Check WooCommerce PayFast settings
- Ensure return URLs are configured

### Order status doesn't update
- Check PayFast IPN is configured
- Verify PayFast can reach WordPress (not localhost)
- Check WooCommerce logs: **WooCommerce → Status → Logs**

### Payment fails
- Verify PayFast credentials
- Check sandbox mode is enabled (for testing)
- Ensure merchant account is active

## Advanced: PayFast Webhook Handler (Optional)

For real-time order updates without polling, create a webhook handler:

```typescript
// /app/api/webhooks/payfast/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  
  // Verify PayFast signature
  // Update order status in your database
  // Send confirmation email
  
  return NextResponse.json({ success: true });
}
```

Then configure in PayFast:
- **Notify URL**: `https://your-site.com/api/webhooks/payfast`

## Next Steps

1. ✅ Test checkout flow end-to-end
2. ✅ Configure PayFast in WooCommerce
3. ✅ Set up return URLs
4. ✅ Test with sandbox credentials
5. ⬜ Go live with production credentials
6. ⬜ Add email notifications
7. ⬜ Add order tracking page

## Support

- [WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [PayFast Integration Guide](https://www.payfast.co.za/integration/shopping-carts/woocommerce/)
- [PayFast Sandbox](https://sandbox.payfast.co.za/)
