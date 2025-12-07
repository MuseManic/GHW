'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';

interface Order {
  id: number;
  order_key: string;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  date_paid: string | null;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image: string;
  }>;
  payment_method_title: string;
  transaction_id: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const orderKey = searchParams.get('key');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    fetchOrder();

    // Poll for order status updates (every 5 seconds for 2 minutes)
    const pollInterval = setInterval(() => {
      if (polling) {
        fetchOrder();
      }
    }, 5000);

    // Stop polling after 2 minutes
    const stopPolling = setTimeout(() => {
      setPolling(false);
      clearInterval(pollInterval);
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(stopPolling);
    };
  }, [orderId, polling]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        
        // Stop polling if order is completed or processing
        if (data.order.status === 'completed' || data.order.status === 'processing') {
          setPolling(false);
        }
      } else {
        setError(data.error || 'Failed to fetch order');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'processing':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Your order has been completed successfully!';
      case 'processing':
        return 'Your payment was successful! We are processing your order.';
      case 'pending':
        return 'Waiting for payment confirmation...';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'cancelled':
        return 'This order was cancelled.';
      default:
        return 'Order status: ' + status;
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Status Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="text-6xl mb-4">
              {order.status === 'completed' || order.status === 'processing' ? '✅' : 
               order.status === 'pending' ? '⏳' : '❌'}
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${getStatusColor(order.status)}`}>
              {getStatusMessage(order.status)}
            </h1>
            <p className="text-gray-600">Order #{order.id}</p>
            {polling && order.status === 'pending' && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="inline-block animate-pulse">●</span> Checking for payment updates...
              </p>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date(order.date_created).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold">{order.payment_method_title}</p>
              </div>
              {order.date_paid && (
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-semibold">{new Date(order.date_paid).toLocaleDateString()}</p>
                </div>
              )}
              {order.transaction_id && (
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold text-sm">{order.transaction_id}</p>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Items</h3>
              {order.line_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">R{parseFloat(item.total).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>
                  {order.currency} {parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Billing Information</h2>
            <p className="text-gray-700">
              {order.billing.first_name} {order.billing.last_name}
            </p>
            <p className="text-gray-700">{order.billing.email}</p>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
