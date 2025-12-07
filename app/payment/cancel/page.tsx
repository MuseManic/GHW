'use client';

import { useRouter } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Cancel Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-gray-600">
              Your payment was cancelled. No charges were made.
            </p>
          </div>

          {/* Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What happened?</h2>
            <p className="text-gray-700 mb-4">
              You cancelled the payment process. Your order has not been placed and no payment was processed.
            </p>
            <p className="text-gray-700">
              If you experienced any issues or have questions, please contact our support team.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/checkout')}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
