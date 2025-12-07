'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductTemplate from '@/components/product-template';

interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  image: string;
  badges: string[];
  slug: string;
}

export default function DynamicProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <ProductTemplate
      id={product.id}
      title={product.title}
      subtitle={product.subtitle}
      price={product.price}
      category={product.category}
      description={product.description}
      ingredients={product.ingredients}
      benefits={product.benefits}
      faqs={product.faqs}
      image={product.image}
      badges={product.badges}
      slug={product.slug}
    />
  );
}
