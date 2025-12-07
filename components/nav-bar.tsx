'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
}

const products = {
  cannafusion: [
    {
      id: '94',
      name: 'Botaani Cannafusion',
      image: '/front-bottle.jpg',
      description: 'Wellness oil with THCa',
      price: 1500
    }
  ],
  beautanicals: [
    {
      id: '810',
      name: 'Botaani Serum',
      image: '/serum.jpg',
      description: 'Lightweight facial serum',
      price: 799
    },
    {
      id: '816',
      name: 'Botaani Face',
      image: '/face.png',
      description: 'Daily face care',
      price: 699
    },
    {
      id: '817',
      name: 'Botaani Body',
      image: '/body.jpg',
      description: 'Body care formula',
      price: 499
    }
  ],
  // animal: [
  //   {
  //     id: 'animal-30ml',
  //     name: 'Animal 30 mL',
  //     image: '/front-bottle.jpg',
  //     description: 'Companion formula',
  //     price: 2000
  //   }
  // ]
};

export default function NavBar() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [cartAnimating, setCartAnimating] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Debug: Log user state changes
  React.useEffect(() => {
    console.log('NavBar user state:', user);
  }, [user]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 600);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm text-gray-900 mb-1">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-3 flex-1">{product.description}</p>
          <p className="text-lg font-bold text-amber-600">R{product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  const DropdownMenu = ({ title, items }: { title: string; items: Product[] }) => (
    <div className="absolute left-0 mt-0 w-screen bg-white shadow-lg z-40 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-xl font-light text-gray-900 mb-8">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="w-full">
      <style>{`
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .cart-shake {
          animation: gentlePulse 0.4s ease-in-out;
        }
      `}</style>
      {/* Top Layer - Black Bar with Logo */}
      <div className="bg-black text-white px-3 sm:px-6 py-4 sm:py-5 flex justify-center items-center relative"   style={{
          backgroundImage: "url('/images/Botaani-26.jpg')",
          backgroundSize: '500%',      
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat'
        }}>
      
      {/* Hamburger Menu - Left */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-3 sm:left-6 text-xl sm:text-2xl cursor-pointer hover:text-[var(--gold)] transition"
        >
          ☰
        </button>

         {/* Logo - Center */}
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-white hover:text-[var(--gold)] transition" style={{ fontFamily: 'Botaani, sans-serif', letterSpacing: '0.25em' }}>
          BOTAANI
        </Link>

        <div className="absolute right-3 sm:right-6 flex items-center gap-4 sm:gap-8">
          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="hover:text-[var(--gold)] transition text-sm sm:text-base flex items-center gap-1" style={{ fontFamily: 'Botaani, sans-serif', letterSpacing: '0.25em' }}
            >
              {user ? user.username : 'Account'}
            </button>
            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50">
                {user ? (
                  <>
                    {/* <Link
                      href="/account/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-t-lg text-sm" 
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      Dashboard
                    </Link> */}
                    <button
                      onClick={async () => {
                        await logout();
                        setAccountDropdownOpen(false);
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition rounded-b-lg text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account/login"
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-t-lg text-sm" 
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/account/register"
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-b-lg text-sm"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button 
            className={`cursor-pointer hover:text-gray-300 transition text-base sm:text-lg relative ${cartAnimating ? 'cart-shake' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCartAnimating(true);
              setTimeout(() => setCartAnimating(false), 600);
            }}
          >
            <Link href="/cart" className="hover:text-gray-300 transition flex items-center">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </button>
        </div>
      </div>


      {/* Sidebar Menu */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Fixed Header with Close Button */}
        <div 
          className={`sticky top-0 border-b border-gray-200 p-6 flex items-center justify-between z-10 text-white transition-all duration-500 ${
            sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{
            backgroundImage: "url('/images/Botaani-26.jpg')",
            backgroundSize: '450%',
            backgroundPosition: 'top right',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000000'
          }}
        >
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Botaani, sans-serif', letterSpacing: '0.25em' }}>
            BOTAANI
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl cursor-pointer hover:text-gray-300 transition"
          >
            &lt;
          </button>
        </div>

        {/* Fixed Search Bar but im hiding it for now because this requires more effort to work correctly */}
        {/* <div className="sticky top-16 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 gap-2">
            <span className="text-gray-600 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm text-black placeholder-gray-500"
            />
          </div>
        </div> */}

        {/* Scrollable Content */}
        <div className={`p-6 space-y-8 transition-all duration-700 ${
          sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          transitionDelay: sidebarOpen ? '200ms' : '0ms'
        }}>
          {/* Cannafusion Section */}
          <div
            onMouseEnter={() => setHoveredCategory('cannafusion')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href="/products/cannafusion"
              onClick={() => setSidebarOpen(false)}
              className="text-lg font-semibold text-gray-900 mb-4 block hover:text-amber-600 transition"
            >
              Cannafusion
            </Link>
            <div className="space-y-3">
              {products.cannafusion.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-amber-50 transition group"
                >
                  <Link
                    href={`/products/cannafusion`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1"
                  >
                    <p className="font-medium text-sm text-gray-900 group-hover:text-amber-600">{product.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                    <p className="text-sm font-semibold text-amber-600 mt-2">R{product.price.toFixed(2)}</p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="ml-2 text-lg hover:scale-110 transition"
                    title="Add to cart"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Beautanicals Section */}
          <div>
            <Link
              href="/products/beautanicals"
              onClick={() => setSidebarOpen(false)}
              className="text-lg font-semibold text-gray-900 mb-4 block hover:text-amber-600 transition"
            >
              Beautanicals
            </Link>
            <div className="space-y-3">
              {products.beautanicals.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-amber-50 transition group"
                >
                  <Link
                    href={`/products/beautanicals/${product.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1"
                  >
                    <p className="font-medium text-sm text-gray-900 group-hover:text-amber-600">{product.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                    <p className="text-sm font-semibold text-amber-600 mt-2">R{product.price.toFixed(2)}</p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="ml-2 text-lg hover:scale-110 transition"
                    title="Add to cart"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Animal Section */}
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Animal</h3>
            <div className="space-y-3">
              {products.animal.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-amber-50 transition group"
                >
                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1"
                  >
                    <p className="font-medium text-sm text-gray-900 group-hover:text-amber-600">{product.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                    <p className="text-sm font-semibold text-amber-600 mt-2">R{product.price.toFixed(2)}</p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="ml-2 text-lg hover:scale-110 transition"
                    title="Add to cart"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          </div> */}
        </div>

      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </nav>
  );
}
