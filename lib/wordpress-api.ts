import axios, { AxiosInstance } from 'axios';

interface WordPressProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  meta_data?: Array<{
    key: string;
    value: string | string[];
  }>;
  acf?: Record<string, any>;
}

interface TransformedProduct {
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

class WordPressAPI {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
    
    const auth = {
      username: process.env.WORDPRESS_API_USERNAME || '',
      password: process.env.WORDPRESS_API_PASSWORD || '',
    };

    console.log('WordPress API Configuration:', {
      baseURL: this.baseURL,
      hasUsername: !!auth.username,
      hasPassword: !!auth.password,
      username: auth.username ? `${auth.username.substring(0, 5)}...` : 'missing'
    });

    this.client = axios.create({
      baseURL: this.baseURL,
      auth: auth.username && auth.password ? auth : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch all products from WooCommerce with ACF fields
   */
  async getProducts(params?: Record<string, any>): Promise<WordPressProduct[]> {
    try {
      const response = await this.client.get('/wc/v3/products', {
        params: {
          per_page: 100,
          status: 'publish',
          acf_format: 'standard', // Ensure ACF fields are included
          ...params,
        },
      });
      
      // Log first product to verify ACF fields are present
      if (response.data.length > 0) {
        console.log('Sample product with ACF:', {
          name: response.data[0].name,
          hasACF: !!response.data[0].acf,
          acfFields: response.data[0].acf ? Object.keys(response.data[0].acf) : []
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching products from WordPress:', error);
      throw error;
    }
  }

  /**
   * Fetch a single product by slug
   */
  async getProductBySlug(slug: string): Promise<WordPressProduct | null> {
    try {
      const response = await this.client.get('/wc/v3/products', {
        params: {
          slug,
          status: 'publish',
        },
      });
      return response.data[0] || null;
    } catch (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: number): Promise<WordPressProduct | null> {
    try {
      const response = await this.client.get(`/wc/v3/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Transform WordPress product to our app format
   */
  transformProduct(wpProduct: WordPressProduct): TransformedProduct {
    const acf = wpProduct.acf || {};
    
    // Get subtitle from ACF or fallback to short description
    const subtitle = acf.product_subheading || this.stripHtml(wpProduct.short_description || '');
    
    // Transform badges from checkbox field (array of strings)
    const badges = Array.isArray(acf.product_badges) && acf.product_badges.length > 0
      ? acf.product_badges
      : ['Vegan', 'Cruelty-free'];
    
    // Transform WYSIWYG fields (ingredients and benefits) to array of strings
    const ingredients = this.transformWysiwygToArray(acf.ingredients);
    const benefits = this.transformWysiwygToArray(acf.benefits);
    
    // Transform FAQs repeater field
    const faqs = Array.isArray(acf.product_faqs) 
      ? acf.product_faqs.map((faq: any) => ({
          question: faq.question || '',
          answer: faq.answer || ''
        }))
      : [];
    
    return {
      id: wpProduct.id,
      title: wpProduct.name,
      subtitle: subtitle || wpProduct.name,
      price: parseFloat(wpProduct.price || wpProduct.regular_price || '0'),
      category: wpProduct.categories?.[0]?.name || 'Uncategorized',
      description: this.stripHtml(wpProduct.description),
      ingredients: ingredients.length > 0 ? ingredients : ['No ingredients listed'],
      benefits: benefits.length > 0 ? benefits : ['No benefits listed'],
      faqs: faqs.length > 0 ? faqs : [],
      image: wpProduct.images?.[0]?.src || '/front-bottle.jpg',
      badges: badges,
      slug: wpProduct.slug,
    };
  }

  /**
   * Transform WYSIWYG editor content to array of strings
   * Splits by <li> tags or line breaks
   */
  private transformWysiwygToArray(content: any): string[] {
    if (!content || typeof content !== 'string') return [];
    
    // Remove all HTML tags first
    let text = this.stripHtml(content);
    
    // If original content had <li> tags, it was a list
    if (content.includes('<li>')) {
      // Extract list items
      const listItems = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
      return listItems
        .map(item => this.stripHtml(item))
        .filter(item => item.trim().length > 0);
    }
    
    // Otherwise split by line breaks
    return text
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}

// Export singleton instance
export const wordPressAPI = new WordPressAPI();
export type { WordPressProduct, TransformedProduct };
