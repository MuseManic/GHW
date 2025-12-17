'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ItemContainerProps {
  image: string;
  title: string;
  description: string;
  price: number;
  href?: string;
}

export default function ItemContainer({ image, title, description, price, href }: ItemContainerProps) {
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
      className="relative w-80 h-[600px] product-item rounded-lg"
      style={{ 
        perspective: '1000px',
        boxShadow: '0 0 0 0px var(--gold)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 40px 4px var(--gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 0px var(--gold)';
      }}
    >
      <div
        className="relative w-full h-full preserve-3d transition-transform duration-700 rounded-lg"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-lg backface-hidden"
          style={{ backgroundColor: 'var(--porcelain)', backfaceVisibility: 'hidden' }}
        >
        {/* Image Container */}
        <Link href={href || (title.includes('Cannafusion') ? `/products/cannafusion` : `/products/beautanicals/${title.toLowerCase().replace(/\s+/g, '-')}`)}>
          <div className="relative h-64 overflow-hidden cursor-pointer" style={{ backgroundColor: 'var(--mist)' }}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

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

          {/* View Details Link */}
          <button
            onClick={() => setIsFlipped(true)}
            className="mb-4 text-sm font-semibold transition-colors hover:text-[var(--gold)] hover:underline"
            style={{ color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
            <div className="flex items-center justify-center gap-2 border-2 rounded-lg p-2" style={{ borderColor: 'var(--brand)' }}>
              <button
                className="w-18 h-12 flex items-center justify-center font-bold text-xl transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity - 1);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
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
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-lg flex flex-col justify-between p-6 backface-hidden cursor-pointer"
          style={{
            backgroundColor: '#000000',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          onClick={() => setIsFlipped(false)}
        >
          <div className="text-white text-md font-semibold">×</div>
          <p className="text-white text-sm leading-relaxed text-justify flex-1 flex items-center">
            {description}
          </p>
          <div></div>
        </div>
      </div>
    </div>
  );
}
