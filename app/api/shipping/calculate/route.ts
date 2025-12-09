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
 * Calculate shipping rates using WooCommerce shipping zones and methods
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

    const baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const auth = {
      username: process.env.WORDPRESS_USERNAME || '',
      password: process.env.WORDPRESS_PASSWORD || ''
    };

    // Get shipping zones
    const zonesResponse = await axios.get(`${baseURL}/wc/v3/shipping/zones`, {
      auth
    });

    console.log('Shipping zones found:', zonesResponse.data.length);

    // Find matching zone for the address
    let matchingZone = null;
    for (const zone of zonesResponse.data) {
      const locationsResponse = await axios.get(
        `${baseURL}/wc/v3/shipping/zones/${zone.id}/locations`,
        { auth }
      );

      // Check if address matches this zone
      for (const location of locationsResponse.data) {
        if (location.type === 'country' && location.code === body.country) {
          matchingZone = zone;
          break;
        }
        if (location.type === 'state' && location.code === `${body.country}:${body.state}`) {
          matchingZone = zone;
          break;
        }
        if (location.type === 'postcode' && location.code === body.postcode) {
          matchingZone = zone;
          break;
        }
      }
      if (matchingZone) break;
    }

    if (!matchingZone) {
      console.log('No matching shipping zone found');
      return NextResponse.json({
        success: true,
        methods: []
      });
    }

    console.log('Matching zone:', matchingZone.name);

    // Get shipping methods for the zone
    const methodsResponse = await axios.get(
      `${baseURL}/wc/v3/shipping/zones/${matchingZone.id}/methods`,
      { auth }
    );

    console.log('Shipping methods found:', methodsResponse.data.length);

    // Filter enabled methods and format response
    const shippingMethods = methodsResponse.data
      .filter((method: any) => method.enabled)
      .map((method: any) => ({
        id: method.method_id,
        instance_id: method.instance_id,
        title: method.method_title,
        cost: parseFloat(method.settings?.cost?.value || '0'),
        description: method.method_description || ''
      }));

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
