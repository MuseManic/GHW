import { NextRequest, NextResponse } from 'next/server';
import { verifyPayFastSignature, getPayFastConfig } from '@/lib/payfast';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for processing

/**
 * PayFast IPN (Instant Payment Notification) Handler
 * This is called by PayFast when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('PayFast IPN received:', {
      payment_status: data.payment_status,
      m_payment_id: data.m_payment_id,
      amount_gross: data.amount_gross
    });

    // Extract signature
    const signature = data.signature;
    delete data.signature;

    // Verify signature
    const config = getPayFastConfig();
    const isValid = verifyPayFastSignature(data, signature, config.passphrase);

    if (!isValid) {
      console.error('Invalid PayFast signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Verify payment status with PayFast server
    const pfHost = config.sandbox 
      ? 'https://sandbox.payfast.co.za'
      : 'https://www.payfast.co.za';

    const pfParamString = new URLSearchParams(data).toString();
    
    try {
      const validationResponse = await axios.post(
        `${pfHost}/eng/query/validate`,
        pfParamString,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (validationResponse.data !== 'VALID') {
        console.error('PayFast validation failed:', validationResponse.data);
        return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
      }
    } catch (validationError) {
      console.error('PayFast validation error:', validationError);
      // Continue anyway in sandbox mode
      if (!config.sandbox) {
        return NextResponse.json({ error: 'Validation error' }, { status: 500 });
      }
    }

    // Payment is valid
    const orderId = data.m_payment_id;
    const paymentStatus = data.payment_status;

    console.log('Valid PayFast payment:', {
      orderId,
      status: paymentStatus,
      amount: data.amount_gross
    });

    // Return 200 OK to PayFast immediately
    // Process WooCommerce update asynchronously to avoid timeout
    if (paymentStatus === 'COMPLETE') {
      // Fire and forget - don't await this
      updateWooCommerceOrder(orderId, data.pf_payment_id).catch((error) => {
        console.error('Async WooCommerce update failed:', error);
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('PayFast IPN error:', error);
    return NextResponse.json(
      { error: 'IPN processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Update WooCommerce order asynchronously
 * This runs in the background to avoid timeout issues
 */
async function updateWooCommerceOrder(orderId: string, paymentId: string): Promise<void> {
  try {
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD;

    if (!username || !password) {
      console.warn('WordPress credentials not configured, skipping order update');
      return;
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wc/v3/orders/${orderId}`,
      {
        status: 'processing',
        transaction_id: paymentId,
        set_paid: true
      },
      {
        auth: {
          username,
          password
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Order updated in WooCommerce:', orderId);
  } catch (error: any) {
    console.error('Failed to update WooCommerce order:', {
      orderId,
      error: error.response?.data || error.message
    });
  }
}
