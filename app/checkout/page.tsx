'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getProductId } from '@/lib/product-ids';

interface FormData {
  // Billing Address
  billingFirstName: string;
  billingLastName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: string;
  billingCity: string;
  billingProvince: string;
  billingPostalCode: string;
  
  // Shipping Address
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  
  // Checkboxes
  sameAsShipping: boolean;
  termsAccepted: boolean;
  ageConfirmed: boolean;
}

interface ShippingMethod {
  id: string;
  instance_id: number;
  title: string;
  cost: number;
  description: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingProvince: '',
    billingPostalCode: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingProvince: '',
    shippingPostalCode: '',
    sameAsShipping: false,
    termsAccepted: false,
    ageConfirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login?redirect=/checkout');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Don't render checkout form if not authenticated
  if (!user) {
    return null;
  }

  // Calculate shipping rates
  const calculateShipping = async () => {
    const shippingAddress = formData.sameAsShipping ? {
      city: formData.billingCity,
      state: formData.billingProvince,
      postcode: formData.billingPostalCode
    } : {
      city: formData.shippingCity,
      state: formData.shippingProvince,
      postcode: formData.shippingPostalCode
    };

    // Only calculate if we have required address fields
    if (!shippingAddress.city || !shippingAddress.postcode) {
      return;
    }

    setLoadingShipping(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: 'ZA',
          state: shippingAddress.state,
          city: shippingAddress.city,
          postcode: shippingAddress.postcode,
          items: cartItems.map(item => ({
            product_id: getProductId(item.id),
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();
      if (data.success && data.methods) {
        setShippingMethods(data.methods);
        // Auto-select first method if available
        if (data.methods.length > 0 && !selectedShipping) {
          setSelectedShipping(data.methods[0]);
        }
      }
    } catch (error) {
      console.error('Failed to calculate shipping:', error);
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Recalculate shipping when address fields change
    if (['shippingCity', 'shippingProvince', 'shippingPostalCode', 'billingCity', 'billingProvince', 'billingPostalCode', 'sameAsShipping'].includes(name)) {
      setTimeout(calculateShipping, 500); // Debounce
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Billing Address validation
    if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'First name is required';
    if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Last name is required';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Email is required';
    if (!formData.billingPhone.trim()) newErrors.billingPhone = 'Phone is required';
    if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Address is required';
    if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
    if (!formData.billingProvince.trim()) newErrors.billingProvince = 'Province is required';
    if (!formData.billingPostalCode.trim()) newErrors.billingPostalCode = 'Postal code is required';

    // Shipping Address validation (if not same as billing)
    if (!formData.sameAsShipping) {
      if (!formData.shippingFirstName.trim()) newErrors.shippingFirstName = 'First name is required';
      if (!formData.shippingLastName.trim()) newErrors.shippingLastName = 'Last name is required';
      if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
      if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';
      if (!formData.shippingProvince.trim()) newErrors.shippingProvince = 'Province is required';
      if (!formData.shippingPostalCode.trim()) newErrors.shippingPostalCode = 'Postal code is required';
    }

    // Checkboxes validation
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    if (!formData.ageConfirmed) newErrors.ageConfirmed = 'You must confirm you are 18 or older';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare shipping address (use billing if same as shipping)
      const shippingData = formData.sameAsShipping
        ? {
            first_name: formData.billingFirstName,
            last_name: formData.billingLastName,
            address_1: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingProvince,
            postcode: formData.billingPostalCode,
            country: 'ZA'
          }
        : {
            first_name: formData.shippingFirstName,
            last_name: formData.shippingLastName,
            address_1: formData.shippingAddress,
            city: formData.shippingCity,
            state: formData.shippingProvince,
            postcode: formData.shippingPostalCode,
            country: 'ZA'
          };

      // Create order via API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          billing: {
            first_name: formData.billingFirstName,
            last_name: formData.billingLastName,
            email: formData.billingEmail,
            phone: formData.billingPhone,
            address_1: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingProvince,
            postcode: formData.billingPostalCode,
            country: 'ZA'
          },
          shipping: shippingData,
          line_items: cartItems.map(item => {
            const productId = getProductId(item.id);
            if (!productId || productId === 0) {
              throw new Error(`Invalid product ID: ${item.id}`);
            }
            return {
              product_id: productId,
              quantity: item.quantity
            };
          }),
          shipping_lines: selectedShipping ? [{
            method_id: selectedShipping.id,
            method_title: selectedShipping.title,
            total: selectedShipping.cost.toFixed(2)
          }] : [],
          customer_id: user?.id || 0
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Order created:', data);
        
        // Initiate PayFast payment
        const paymentResponse = await fetch('/api/payfast/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: data.order_id.toString(),
            amount: parseFloat(data.total),
            itemName: `Order #${data.order_id}`,
            itemDescription: `Botaani Order #${data.order_id}`,
            firstName: formData.billingFirstName,
            lastName: formData.billingLastName,
            email: formData.billingEmail,
            cellNumber: formData.billingPhone
          })
        });

        const paymentData = await paymentResponse.json();

        if (paymentData.success) {
          console.log('Payment data received:', paymentData);
          
          // Store payment data in session storage
          const storageKey = `payment_${data.order_id}`;
          sessionStorage.setItem(storageKey, JSON.stringify(paymentData));
          
          // Verify it was stored
          const stored = sessionStorage.getItem(storageKey);
          console.log('Stored in sessionStorage:', storageKey, !!stored);

          // Clear cart
          clearCart();

          // Redirect to payment processing page
          window.location.href = `/payment/process?order_id=${data.order_id}`;
        } else {
          alert('Failed to initiate payment: ' + (paymentData.details || paymentData.error));
          setSubmitting(false);
        }
      } else {
        alert('Failed to create order: ' + (data.details || data.error));
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <main>
        <NavBar />

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Billing Address Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="billingFirstName"
                      value={formData.billingFirstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingFirstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingFirstName && <p className="text-red-600 text-sm mt-1">{errors.billingFirstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="billingLastName"
                      value={formData.billingLastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingLastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingLastName && <p className="text-red-600 text-sm mt-1">{errors.billingLastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="billingEmail"
                      value={formData.billingEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingEmail && <p className="text-red-600 text-sm mt-1">{errors.billingEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="billingPhone"
                      value={formData.billingPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingPhone && <p className="text-red-600 text-sm mt-1">{errors.billingPhone}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.billingAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                  {errors.billingAddress && <p className="text-red-600 text-sm mt-1">{errors.billingAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingCity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingCity && <p className="text-red-600 text-sm mt-1">{errors.billingCity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      name="billingProvince"
                      value={formData.billingProvince}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingProvince ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingProvince && <p className="text-red-600 text-sm mt-1">{errors.billingProvince}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="billingPostalCode"
                      value={formData.billingPostalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingPostalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.billingPostalCode && <p className="text-red-600 text-sm mt-1">{errors.billingPostalCode}</p>}
                  </div>
                </div>
              </div>

              {/* Same as Billing Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  name="sameAsShipping"
                  checked={formData.sameAsShipping}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: 'var(--brand)' }}
                />
                <label htmlFor="sameAsShipping" className="text-gray-900 font-semibold cursor-pointer">
                  Shipping address is the same as billing address
                </label>
              </div>

              {/* Shipping Address Section */}
              {!formData.sameAsShipping && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="shippingFirstName"
                        value={formData.shippingFirstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.shippingFirstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {errors.shippingFirstName && <p className="text-red-600 text-sm mt-1">{errors.shippingFirstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="shippingLastName"
                        value={formData.shippingLastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.shippingLastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {errors.shippingLastName && <p className="text-red-600 text-sm mt-1">{errors.shippingLastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.shippingAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {errors.shippingAddress && <p className="text-red-600 text-sm mt-1">{errors.shippingAddress}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.shippingCity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {errors.shippingCity && <p className="text-red-600 text-sm mt-1">{errors.shippingCity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Province *
                      </label>
                      <input
                        type="text"
                        name="shippingProvince"
                        value={formData.shippingProvince}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.shippingProvince ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {errors.shippingProvince && <p className="text-red-600 text-sm mt-1">{errors.shippingProvince}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="shippingPostalCode"
                        value={formData.shippingPostalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.shippingPostalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {errors.shippingPostalCode && <p className="text-red-600 text-sm mt-1">{errors.shippingPostalCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Methods */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Method</h2>
                
                {loadingShipping ? (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>Calculating shipping rates...</span>
                  </div>
                ) : shippingMethods.length > 0 ? (
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.instance_id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedShipping?.instance_id === method.instance_id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.instance_id === method.instance_id}
                            onChange={() => setSelectedShipping(method)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: 'var(--brand)' }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{method.title}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">
                          R{method.cost.toFixed(2)}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p>Please enter your shipping address to see available shipping options.</p>
                  </div>
                )}
              </div>

              {/* Terms and Age Confirmation */}
              <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded cursor-pointer mt-1"
                    style={{ accentColor: 'var(--brand)' }}
                  />
                  <label htmlFor="termsAccepted" className="text-gray-900 cursor-pointer">
                    I have read and agree to the{' '}
                    <Link href="/info/terms" className="text-amber-600 hover:text-amber-700 font-semibold">
                      Terms and Conditions
                    </Link>
                    {' '}*
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-red-600 text-sm">{errors.termsAccepted}</p>}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ageConfirmed"
                    name="ageConfirmed"
                    checked={formData.ageConfirmed}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded cursor-pointer mt-1"
                    style={{ accentColor: 'var(--brand)' }}
                  />
                  <label htmlFor="ageConfirmed" className="text-gray-900 cursor-pointer">
                    I confirm that I am 18 years of age or older *
                  </label>
                </div>
                {errors.ageConfirmed && <p className="text-red-600 text-sm">{errors.ageConfirmed}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link
                  href="/cart"
                  className="flex-1 text-center py-3 rounded-lg font-semibold border-2 transition-all duration-300"
                  style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--brand)';
                  }}
                >
                  Back to Cart
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: submitting ? '#999' : 'var(--brand)' }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'var(--gold)')}
                  onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'var(--brand)')}
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
