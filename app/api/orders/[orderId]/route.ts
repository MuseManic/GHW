import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    console.log('Fetching order status:', orderId);

    // Fetch order from WooCommerce
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wc/v3/orders/${orderId}`,
      {
        auth: {
          username: process.env.WORDPRESS_API_USERNAME || '',
          password: process.env.WORDPRESS_API_PASSWORD || ''
        }
      }
    );

    const order = response.data;

    console.log('Order status:', {
      order_id: order.id,
      status: order.status,
      total: order.total
    });

    // Return order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_key: order.order_key,
        status: order.status,
        total: order.total,
        currency: order.currency,
        date_created: order.date_created,
        date_paid: order.date_paid,
        billing: order.billing,
        shipping: order.shipping,
        line_items: order.line_items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          total: item.total,
          image: item.image?.src
        })),
        payment_method: order.payment_method,
        payment_method_title: order.payment_method_title,
        transaction_id: order.transaction_id
      }
    });

  } catch (error: any) {
    console.error('Order fetch error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
        details: error.response?.data?.message || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}
