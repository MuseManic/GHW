import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

interface OrderLineItem {
  product_id: number;
  quantity: number;
}

interface ShippingLine {
  method_id: string;
  method_title: string;
  total: string;
}

interface CouponLine {
  code: string;
}

interface CreateOrderRequest {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: OrderLineItem[];
  customer_id?: number;
  shipping_lines?: ShippingLine[];
  coupon_lines?: CouponLine[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    console.log('Creating WooCommerce order:', {
      billing: body.billing.email,
      items: body.line_items.length
    });

    const wcOrder: Record<string, unknown> = {
      payment_method: 'payfast',
      payment_method_title: 'PayFast',
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
      customer_id: body.customer_id || 0,
      status: 'pending'
    };

    if (body.shipping_lines?.length) {
      wcOrder.shipping_lines = body.shipping_lines;
    }

    if (body.coupon_lines?.length) {
      wcOrder.coupon_lines = body.coupon_lines;
    }

    // Create order in WooCommerce
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wc/v3/orders`,
      wcOrder,
      {
        auth: {
          username: process.env.CONSUMER_KEY || '',
          password: process.env.CONSUMER_SECRET || ''
        }
      }
    );

    const order = response.data;

    console.log('Order created successfully:', {
      order_id: order.id,
      order_key: order.order_key,
      total: order.total
    });

    // Return order details including checkout URL
    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      total: order.total,
      currency: order.currency,
      status: order.status,
      // WooCommerce checkout URL for PayFast
      checkout_url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`,
      // Alternative: Direct order view URL
      order_url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}checkout/order-received/${order.id}/?key=${order.order_key}`
    });

  } catch (error: any) {
    console.error('Order creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      fullError: error
    });

    // Extract actual error message from HTML if present
    let errorMessage = error.message;
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        // Try to extract error from HTML
        const match = error.response.data.match(/<title>(.*?)<\/title>/);
        if (match) {
          errorMessage = match[1];
        } else {
          errorMessage = 'WordPress returned an HTML error page (likely a PHP error)';
        }
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        details: errorMessage,
        debug: {
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method
        }
      },
      { status: error.response?.status || 500 }
    );
  }
}
