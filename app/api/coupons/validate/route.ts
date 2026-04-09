import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

interface WooCoupon {
  id: number;
  code: string;
  amount?: string;
  discount_type?: string;
  date_expires?: string | null;
  usage_limit?: number | null;
  usage_count?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!raw) {
      return NextResponse.json(
        { success: false, error: 'Enter a coupon code' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: 'Store API is not configured' },
        { status: 500 }
      );
    }

    const { data } = await axios.get<WooCoupon[]>(`${baseUrl}/wc/v3/coupons`, {
      params: { search: raw, per_page: 100 },
      auth: {
        username: process.env.CONSUMER_KEY || '',
        password: process.env.CONSUMER_SECRET || ''
      }
    });

    const coupon = data?.find(
      (c) => c.code?.toLowerCase() === raw.toLowerCase()
    );

    if (!coupon) {
      return NextResponse.json({
        success: false,
        error: 'That coupon code is not valid'
      });
    }

    if (coupon.date_expires) {
      const expires = new Date(coupon.date_expires);
      if (!Number.isNaN(expires.getTime()) && expires < new Date()) {
        return NextResponse.json({
          success: false,
          error: 'This coupon has expired'
        });
      }
    }

    if (
      coupon.usage_limit != null &&
      coupon.usage_limit > 0 &&
      (coupon.usage_count ?? 0) >= coupon.usage_limit
    ) {
      return NextResponse.json({
        success: false,
        error: 'This coupon has reached its usage limit'
      });
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      amount: coupon.amount
    });
  } catch (error: unknown) {
    console.error('Coupon validate error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not check coupon right now' },
      { status: 500 }
    );
  }
}
