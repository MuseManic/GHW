'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import PayFastForm from '@/components/payfast-form';

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Payment process page loaded, orderId:', orderId);
    
    if (!orderId) {
      console.error('No order ID in URL');
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    // Payment data should be passed via sessionStorage for security
    const storageKey = `payment_${orderId}`;
    console.log('Looking for sessionStorage key:', storageKey);
    
    const storedData = sessionStorage.getItem(storageKey);
    console.log('SessionStorage data found:', !!storedData);
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log('Payment data parsed successfully');
        setPaymentData(data);
        // Clear from session storage
        sessionStorage.removeItem(storageKey);
      } catch (err) {
        console.error('Failed to parse payment data:', err);
        setError('Invalid payment data');
      }
    } else {
      console.error('No payment data in sessionStorage');
      console.log('Available sessionStorage keys:', Object.keys(sessionStorage));
      setError('Payment session expired. Please try checking out again.');
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !paymentData) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Unable to process payment'}</p>
            <a
              href="/checkout"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 inline-block"
            >
              Return to Checkout
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <PayFastForm
        paymentData={paymentData.paymentData}
        signature={paymentData.signature}
        processUrl={paymentData.processUrl}
        autoSubmit={true}
      />
      <Footer />
    </>
  );
}
