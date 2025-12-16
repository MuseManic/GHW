import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

interface CalculateShippingRequest {
  country: string;
  state: string;
  city: string;
  postcode: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

/**
 * Calculate shipping rates - flat R120 rate
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculateShippingRequest = await request.json();

    console.log('Calculating shipping for:', {
      country: body.country,
      state: body.state,
      city: body.city,
      postcode: body.postcode,
      items: body.items.length
    });

    // Return flat R120 shipping rate
    const shippingMethods = [
      {
        id: 'flat_rate',
        instance_id: 1,
        title: 'Shipping',
        cost: 120,
        description: 'Standard shipping'
      }
    ];

    console.log('Shipping method:', JSON.stringify(shippingMethods, null, 2));

    return NextResponse.json({
      success: true,
      methods: shippingMethods
    });

  } catch (error: any) {
    console.error('Shipping calculation error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate shipping',
        details: error.message
      },
      { status: 500 }
    );
  }
}
