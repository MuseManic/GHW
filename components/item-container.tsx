'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ItemContainerProps {
  image: string;
  title: string;
  description: string;
  price: number;
}

export default function ItemContainer({ image, title, description, price }: ItemContainerProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price,
      quantity,
      image
    });
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div
      className="relative w-80 h-[600px] preserve-3d transition-transform duration-700"
      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', boxShadow: '0 0 0 0px var(--gold)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 40px 4px var(--gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 0px var(--gold)';
      }}
    >
      {/* Front Face */}
      <div
        className="absolute inset-0 w-80 h-full rounded-lg overflow-hidden shadow-lg backface-hidden"
        style={{ backgroundColor: 'var(--porcelain)', backfaceVisibility: 'hidden' }}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden" style={{ backgroundColor: 'var(--mist)' }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Title */}
          <Link href={title.includes('Cannafusion') ? `/products/cannafusion` : `/products/beautanicals/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <h3
              className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer"
              style={{ color: 'var(--ink)' }}
            >
              {title}
            </h3>
          </Link>

          {/* View Details Button */}
          <button
            onClick={() => setIsFlipped(true)}
            className="mb-4 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: 'var(--brand)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand)')}
          >
            View Details
          </button>

          {/* Price */}
          <div className="mb-4">
            <p
              className="text-2xl font-bold transition-colors duration-300"
              style={{ color: isFlipped ? 'var(--gold)' : '#000000ff' }}
            >
              R{price.toFixed(2)}
            </p>
          </div>

          {/* Quantity Stepper */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Quantity
            </label>
            <div className="flex items-center justify-center gap-2 border-2 rounded-lg p-2" style={{ borderColor: 'var(--brand)' }}>
              <button
                className="w-18 h-12 flex items-center justify-center font-bold text-xl transition-colors"
                onClick={() => setQuantity(quantity - 1)}
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
                className="w-18 h-12 flex items-center justify-center font-bold text-xl transition-colors"
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
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
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
        </div>
      </div>

      {/* Back Face (Description Only) */}
      <div
        className="absolute inset-0 w-80 h-full rounded-lg overflow-hidden shadow-lg flex flex-col justify-center items-center p-6 backface-hidden cursor-pointer"
        style={{
          backgroundColor: '#000000',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
        onClick={() => setIsFlipped(false)}
      >
        <p className="text-white text-sm leading-relaxed text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
