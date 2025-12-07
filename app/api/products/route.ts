import { NextRequest, NextResponse } from 'next/server';
import { wordPressAPI } from '@/lib/wordpress-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    console.log('Products API called:', { slug, hasSlug: !!slug });

    let product;

    if (slug) {
      // Fetch single product by slug
      console.log('Fetching single product:', slug);
      product = await wordPressAPI.getProductBySlug(slug);
      if (!product) {
        console.error('Product not found:', slug);
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    } else {
      // Fetch all products
      console.log('Fetching all products...');
      const products = await wordPressAPI.getProducts();
      console.log(`Fetched ${products.length} products from WordPress`);
      const transformed = products.map(p => wordPressAPI.transformProduct(p));
      return NextResponse.json(transformed);
    }

    const transformed = wordPressAPI.transformProduct(product);
    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error.message,
        status: error.response?.status
      },
      { status: 500 }
    );
  }
}
