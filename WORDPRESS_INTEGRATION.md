# WordPress Headless Integration Guide

This document outlines the setup and integration of your Next.js frontend with WordPress as a headless CMS.

## Architecture Overview

```
WordPress (Headless CMS)
    ↓
WooCommerce REST API
    ↓
Next.js Frontend
    ↓
Client Browser
```

## Prerequisites

### WordPress Setup
1. **WordPress Installation**: Your WordPress site must be accessible via HTTPS
2. **WooCommerce Plugin**: Already installed ✅
3. **ACF Pro Plugin**: Already installed ✅ (for custom fields)
4. **REST API**: Enabled by default in WordPress 4.7+

### Authentication
You have two options:

#### Option 1: Application Passwords (Recommended)
1. Go to WordPress Admin → Users → Your User
2. Scroll down to "Application Passwords"
3. Create a new application password named "Next.js Frontend"
4. Copy the generated password

#### Option 2: Basic Auth (Less Secure)
- Use your WordPress username and password directly

## Configuration

### 1. Update Environment Variables

Edit `.env.local` with your WordPress details:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
WORDPRESS_API_USERNAME=your_username
WORDPRESS_API_PASSWORD=your_app_password_or_password
NEXT_PUBLIC_ACF_ENABLED=true
NEXT_PUBLIC_CACHE_REVALIDATE=3600
```

### 2. Install Dependencies

```bash
npm install
```

This will install axios for API requests.

## WordPress Configuration

### Enable REST API Access

1. **Check REST API is accessible**:
   ```
   https://your-wordpress-site.com/wp-json/wc/v3/products
   ```

2. **If you get 401 Unauthorized**, configure authentication:
   - Go to WordPress Settings → Permalinks
   - Ensure "Post name" or another non-default structure is selected
   - Save changes

3. **If Wordfence is blocking requests**:
   - Go to Wordfence → Tools → Diagnostics
   - Check "REST API" section
   - Whitelist your Next.js domain if needed

### Configure ACF Fields for Products

To use custom fields (ingredients, benefits, FAQs), set up ACF fields on your WooCommerce products:

1. Go to WordPress Admin → ACF → Field Groups
2. Create a new field group for products:
   - **Ingredients** (Repeater field)
     - Sub-field: `ingredient` (Text)
   - **Benefits** (Repeater field)
     - Sub-field: `benefit` (Text)
   - **FAQs** (Repeater field)
     - Sub-fields: `question` (Text), `answer` (Textarea)
   - **Badges** (Repeater field)
     - Sub-field: `badge` (Text)

3. Set the field group to show on "Product" post type

## API Endpoints

### Fetch All Products
```
GET /api/products
```

Returns array of transformed products.

### Fetch Single Product by Slug
```
GET /api/products?slug=product-slug
```

Returns single transformed product.

## Product Data Structure

### WordPress WooCommerce Product
```json
{
  "id": 123,
  "name": "Product Name",
  "slug": "product-slug",
  "description": "<p>HTML Description</p>",
  "short_description": "Short description",
  "price": "99.99",
  "images": [
    {
      "src": "https://example.com/image.jpg",
      "alt": "Product image"
    }
  ],
  "categories": [
    {
      "name": "Category Name",
      "slug": "category-slug"
    }
  ],
  "acf": {
    "ingredients": ["Ingredient 1", "Ingredient 2"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "faqs": [
      {
        "question": "Question?",
        "answer": "Answer"
      }
    ],
    "badges": ["Vegan", "Cruelty-free"]
  }
}
```

### Transformed Product (Used in Next.js)
```json
{
  "id": 123,
  "title": "Product Name",
  "subtitle": "Short description",
  "price": 99.99,
  "category": "Category Name",
  "description": "HTML-stripped description",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "faqs": [
    {
      "question": "Question?",
      "answer": "Answer"
    }
  ],
  "image": "https://example.com/image.jpg",
  "badges": ["Vegan", "Cruelty-free"],
  "slug": "product-slug"
}
```

## Usage in Components

### Using the Hook (Client Component)
```tsx
'use client';

import { useProducts } from '@/hooks/useProducts';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Using Server-Side Fetch (Server Component)
```tsx
import { wordPressAPI } from '@/lib/wordpress-api';

export default async function ProductPage() {
  const wpProduct = await wordPressAPI.getProductBySlug('product-slug');
  if (!wpProduct) return <div>Not found</div>;
  
  const product = wordPressAPI.transformProduct(wpProduct);
  
  return <ProductTemplate {...product} />;
}
```

## Migration Steps

### Phase 1: Setup (Current)
- [x] Install dependencies
- [x] Configure environment variables
- [x] Create WordPress API service
- [x] Create API routes
- [x] Create React hooks

### Phase 2: Testing
- [ ] Test API connectivity
- [ ] Verify product fetching
- [ ] Test ACF field retrieval

### Phase 3: Migration
- [ ] Update home page to use API
- [ ] Update product pages to use API
- [ ] Remove hardcoded product data
- [ ] Test all product pages

### Phase 4: Optimization
- [ ] Implement caching strategy
- [ ] Add error boundaries
- [ ] Optimize images
- [ ] Monitor API performance

## Troubleshooting

### 401 Unauthorized
- Verify credentials in `.env.local`
- Check application password is correct
- Ensure user has API access permissions

### 404 Not Found
- Verify WordPress URL is correct
- Check product exists in WordPress
- Verify product is published (not draft)

### CORS Issues
- Add your Next.js domain to WordPress CORS headers
- Or use server-side API routes (recommended)

### Slow API Responses
- Enable caching with ISR (Incremental Static Regeneration)
- Reduce number of products fetched
- Optimize WordPress database

## Next Steps

1. Update `.env.local` with your WordPress credentials
2. Run `npm install` to install dependencies
3. Test the API endpoint: `http://localhost:3000/api/products`
4. Begin migrating components to use WordPress data

## Resources

- [WooCommerce REST API Docs](https://woocommerce.com/document/woocommerce-rest-api/)
- [ACF REST API Support](https://www.advancedcustomfields.com/resources/rest-api-enabled/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
