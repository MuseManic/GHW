import { useState, useEffect } from 'react';
import type { TransformedProduct } from '@/lib/wordpress-api';

interface UseProductsOptions {
  slug?: string;
  revalidate?: boolean;
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL('/api/products', window.location.origin);
        if (options?.slug) {
          url.searchParams.append('slug', options.slug);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Handle both single product and array of products
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([data]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.slug]);

  return { products, loading, error };
}
