'use client';

import Footer from '@/components/footer';
import Link from 'next/link';
import NavBar from '@/components/nav-bar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      {/* Header */}
 

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Company Info */}
        <h2 className="text-5xl font-bold text-gray-900 mb-8">Contact Us</h2>
        <section id="contact" className="mb-16 bg-gray-50 rounded-lg p-8">
          <div className="space-y-3 text-base text-gray-700">
            <p><strong>Company:</strong> Global Health Wellness Sales (Pty) Ltd</p>
            <p><strong>Registration No:</strong> 2021/408077/07</p>
            <p><strong>VAT:</strong> 4090300155</p>
            <p><strong>Contact:</strong> sales@ghwsales.com</p>
            <p><strong>Phone and WhatsApp: </strong>+27 64 799 9954</p>
          </div>
        </section>

        {/* Pricing & Payment */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Pricing & Payment</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>Prices are shown in ZAR, inclusive of 15% VAT.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>Payments via PayFast (Card, Instant EFT).</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>An order is accepted when funds reflect.</span>
            </li>
          </ul>
        </section>

        {/* Shipping & Delivery */}
        <section id="delivery" className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Shipping and Delivery</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span><strong>Courier:</strong> The Courier Guy; SA only.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span><strong>Typical delivery:</strong> ~3 business days to main centres; 3–5 regional/remote.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span><strong>Risk passes:</strong> On signature (or at authorised safe-drop if you select it).</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span><strong>Address changes:</strong> After dispatch may incur fees.</span>
            </li>
          </ul>
        </section>

        {/* Age & Compliance */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Age & Compliance</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Botaani Cannafusion:</strong> 18+. We may request ID before dispatch. Avoid heat exposure. Statements not evaluated by SAHPRA and not intended to diagnose, treat, cure, or prevent disease.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Botaani Animal:</strong> Not a veterinary medicine. Consult your veterinarian. Statements not evaluated by SAHPRA and not intended to diagnose, treat, cure, or prevent disease.
              </span>
            </li>
          </ul>
        </section>

        {/* Liability & Indemnity */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Liability & Indemnity</h2>
          <p className="text-gray-700 leading-relaxed">
            To the extent permitted by law, our liability for any claim is limited to the price paid for the product. You agree not to misuse the products or resell without authorisation.
          </p>
        </section>

        {/* Force Majeure */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Force Majeure</h2>
          <p className="text-gray-700 leading-relaxed">
            We aren't liable for delays or failures caused by events beyond our reasonable control (e.g., load shedding, strikes, courier disruptions).
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            We're here to help with orders, deliveries, COAs, and general questions.
          </p>
          <div className="space-y-4 text-gray-700 mb-8">
            <p><strong>Email:</strong> sales@ghwsales.com</p>
            <p><strong>Phone:</strong> +27 64 799 9954</p>
            <p><strong>WhatsApp:</strong> +27 64 799 9954</p>
            <p><strong>Hours:</strong> Mon–Fri, 08:00–16:00 (SAST)</p>
          </div>
          
          <div className="mb-8">
            <p className="font-semibold text-gray-900 mb-3">Returns address (no public collections):</p>
            <p className="text-gray-700">
              Unit 6B Romead Business Park, 19 Malone Road, Maxmead, Pinetown, Durban, KwaZulu-Natal, South Africa
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3">COAs:</p>
            <p className="text-gray-700">
              Available on request. Typical turnaround 1–2 business days from receipt of your email.
            </p>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-3">What to include when you contact us:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Order number (if applicable)</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Full name, phone, and delivery address</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Summary of the query (e.g., delivery, product question, return)</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>For quality issues: clear photos and a brief description</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Your privacy is important to us. We collect personal information (name, email, address, phone) only to process orders and communicate with you. We do not share your data with third parties without your consent, except where required by law. Your data is stored securely and retained only as long as necessary for the purposes outlined.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For questions about how we handle your data, contact sales@ghwsales.com.
          </p>
        </section>

        {/* Returns & Refunds Policy (Terms & Conditions) */}
        <section id="terms" className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Returns & Refunds Policy</h2>
          <p className="text-gray-700 mb-8">
            We aim to make returns straightforward and fair while complying with South African law.
          </p>

      <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Returns & Cooling-off</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>ECTA 7-day cooling-off applies to unopened/unused goods purchased online.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>Beyond ECTA cooling-off, we do not accept voluntary returns.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span><strong>Defective goods (CPA):</strong> Repair/replace/refund within 6 months of delivery, per assessment.</span>
            </li>
          </ul>
        </div>

          {/* Cooling-off */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cooling-off (ECTA)</h3>
            <p className="text-gray-700">
              For online purchases, you may cancel and return unopened/unused goods within 7 calendar days of delivery for a refund of the product price (less any applicable courier costs). Email sales@ghwsales.com to start the process.
            </p>
          </div>

          {/* Defective Goods */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Defective Goods (CPA)</h3>
            <p className="text-gray-700">
              If your product is defective, we'll repair, replace, or refund within 6 months of delivery once assessed. Contact sales@ghwsales.com with details and photos.
            </p>
          </div>

          {/* Market Complaint Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Complaint Form</h3>
            <p className="text-gray-700 mb-4">
              For damaged/short deliveries or quality concerns:
            </p>
            <ol className="space-y-3 text-gray-700 ml-4">
              <li className="flex gap-4">
                <span className="font-semibold min-w-fit">1.</span>
                <span>Keep all packaging, take photos, and email sales@ghwsales.com to request the Market Complaint Form.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-fit">2.</span>
                <span>Complete and email the form to sales@ghwsales.com.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-fit">3.</span>
                <span>Once approved, replacements ship within 7 days.</span>
              </li>
            </ol>
          </div>

          {/* Exclusions & Notes */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclusions & Notes</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>For hygiene and safety, opened/used products cannot be returned unless defective.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Cannafusion is 18+; we may request ID before dispatch.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Botaani Animal is not a veterinary medicine; consult your veterinarian.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-400">•</span>
                <span>Refunds are processed to the original payment method.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
