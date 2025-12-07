'use client';

import { useState } from 'react';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import { useCart } from '@/context/CartContext';

interface ProductTemplateProps {
  id?: number | string; // WooCommerce product ID
  title: string;
  subtitle: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  image?: string;
  badges?: string[];
  slug?: string; // Product slug for fallback
}

export default function ProductTemplate({
  id,
  title,
  subtitle,
  price,
  category,
  description,
  ingredients,
  benefits,
  faqs,
  image = '/front-bottle.jpg',
  badges = ['Vegan', 'Cruelty-free'],
  slug
}: ProductTemplateProps) {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Use product ID if available, otherwise fall back to slug or title-based ID
    const productId = id 
      ? String(id) 
      : slug 
      ? slug 
      : title.toLowerCase().replace(/\s+/g, '-');

    addToCart({
      id: productId,
      name: title,
      price,
      quantity,
      image
    });
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <head>
        <title>{title} | Botaani</title>
        <meta name="description" content={subtitle} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
      </head>

      <main>
        <NavBar />

        {/* Product Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{category}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-xl text-gray-700">{subtitle}</p>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold" style={{ color: 'var(--gold)' }}>
                  R{price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">{badges.join(' • ')}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                  Quantity
                </label>
                <div className="flex items-center gap-4 border-2 rounded-lg p-2 w-fit" style={{ borderColor: 'var(--brand)' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 font-bold text-lg transition-colors"
                    style={{ color: 'var(--brand)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--brand)')}
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold px-4" style={{ color: 'var(--ink)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 font-bold text-lg transition-colors"
                    style={{ color: 'var(--brand)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--brand)')}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg mb-4"
                style={{
                  backgroundColor: isAdded ? '#10b981' : 'var(--brand)',
                  transform: isAdded ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isAdded ? '0 0 20px rgba(16, 185, 129, 0.6)' : 'none',
                }}
                onMouseEnter={(e) => !isAdded && (e.currentTarget.style.backgroundColor = 'var(--gold)')}
                onMouseLeave={(e) => !isAdded && (e.currentTarget.style.backgroundColor = 'var(--brand)')}
              >
                {isAdded ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Key Benefits */}
              <div className="space-y-2 text-sm text-gray-700">
                {benefits.map((benefit, idx) => (
                  <p key={idx}>✓ {benefit}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-300 mb-8">
              {['description', 'ingredients', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === tab ? { borderBottomColor: 'var(--gold)' } : {}}
                >
                  {tab === 'faq' ? 'FAQ' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg p-8">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Ingredients</h3>
                  <ul className="space-y-3 text-gray-700">
                    {ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-bold" style={{ color: 'var(--gold)' }}>•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>{badges.join(' • ')}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full px-4 py-3 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between uppercase"
                      >
                        {faq.question}
                        <span className="text-lg">{expandedFaq === index ? '−' : '+'}</span>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 py-3 bg-gray-50 text-gray-700 border-t border-gray-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
