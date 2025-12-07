'use client';

import { useEffect, useRef } from 'react';

interface PayFastFormProps {
  paymentData: Record<string, string>;
  signature: string;
  processUrl: string;
  autoSubmit?: boolean;
}

export default function PayFastForm({ 
  paymentData, 
  signature, 
  processUrl,
  autoSubmit = true 
}: PayFastFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoSubmit && formRef.current) {
      // Auto-submit form after component mounts
      formRef.current.submit();
    }
  }, [autoSubmit]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting to Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we redirect you to PayFast...
          </p>
        </div>

        <form 
          ref={formRef}
          action={processUrl} 
          method="POST"
          className="space-y-4"
        >
          {/* Hidden fields for PayFast */}
          {Object.entries(paymentData).map(([key, value]) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={value}
            />
          ))}
          <input type="hidden" name="signature" value={signature} />

          {!autoSubmit && (
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Proceed to Payment
            </button>
          )}
        </form>

        <p className="text-xs text-gray-500 mt-4">
          You will be redirected to PayFast's secure payment page
        </p>
      </div>
    </div>
  );
}
