'use client';

import Link from 'next/link';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <>
      <main>
        <NavBar />

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600">R{item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:text-amber-600 transition"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-amber-600 transition"
                          >
                            +
                          </button>
                        </div>

                        <p className="font-semibold text-gray-900 w-24 text-right">
                          R{(item.price * item.quantity).toFixed(2)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 transition font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>R{subtotal.toFixed(2)}</span>
                      </div>
                      {/* <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
                      </div> */}
                    </div>

                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                      <span>Total</span>
                      <span style={{ color: 'var(--gold)' }}>R{total.toFixed(2)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      className="w-full block text-center py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
                      style={{ backgroundColor: 'var(--brand)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand)')}
                    >
                      Proceed to Checkout
                    </Link>

                    {/* <p className="text-xs text-gray-600 text-center mt-4">
                      Free shipping on orders over R500
                    </p> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}