'use client';

import Link from 'next/link';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';

export default function AdditionalInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      {/* Header */}
      <header className="border-b border-gray-200 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block">
            ← Back
          </Link> */}
          
          {/* Tagline with slide-in animation */}
          <style>{`
            @keyframes slideInFromRight {
              from {
                opacity: 0;
                transform: translateX(100px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .tagline-animate {
              animation: slideInFromRight 0.8s ease-out;
            }
            @keyframes slideInFromLeft {
              from {
                opacity: 0;
                transform: translateX(-100px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes slideInFromRightAnim {
              from {
                opacity: 0;
                transform: translateX(100px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .section-animate-left {
              animation: slideInFromLeft 0.8s ease-out forwards;
              opacity: 0;
            }
            .section-animate-right {
              animation: slideInFromRightAnim 0.8s ease-out forwards;
              opacity: 0;
            }
          `}</style>
          
          <div className="flex flex-col items-center text-center mb-8 tagline-animate">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">Back to Nature.</h1>
            <p className="text-6xl font-bold text-gray-900">Forward in Thought.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We began Botaani with a simple promise: if we wouldn't give it to the people (and animals) we love, we won't make it. That's why every formula is pared back, honest, and carefully verified—so we can hand it to family first, and feel confident sharing it with you.
          </p>
        </section>

        {/* What Guides Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">What guides us</h2>
          <p className="text-gray-700 leading-relaxed">
            We take nature as it is and bottle it—respecting the plant, protecting its integrity, and keeping the ingredient list minimal. We use clean ingredients and uphold meticulous quality standards, so what reaches you is as close to nature as we can keep it.
          </p>
        </section>

        {/* How We Work */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">How we work</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Licensed & documented.</strong> GACP cultivation and GMP-licensed manufacturing underpin our processes, with batch Certificates of Analysis (COAs) available on request for transparency.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Made in South Africa.</strong> Local production with rigorous, audit-ready QA practices.
              </span>
            </li>
          </ul>
        </section>

        {/* What We Make */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">What we make (at a glance)</h2>
          <div className="space-y-8">
            {/* Cannafusion */}
            <div className="border-l-4 border-gray-200 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Botaani Cannafusion — 15 mL</h3>
              <p className="text-gray-700 mb-3">
                A minimal, glycerin-based wellness oil containing Trace amounts of THCa in 99.99% BP-grade glycerin. Intended for adults seeking simple, non-psychoactive* support for everyday balance. 21+ only. Avoid heat exposure.
              </p>
              <p className="text-sm text-gray-600 italic">
                Statements not evaluated by SAHPRA. Not intended to diagnose, treat, cure or prevent disease.
              </p>
            </div>

            {/* Beautanicals */}
            <div className="border-l-4 border-gray-200 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Botaani Beautanicals — Serum, Face, Body & Cleanse</h3>
              <p className="text-gray-700">
                Vegan, cruelty-free skincare designed for daily comfort and glow. Lightweight textures, clean botanicals, and straightforward directions. May assist with hydration, barrier comfort and a healthy-looking sheen—without harsh shortcuts.
              </p>
            </div>

            {/* Animal */}
            <div className="border-l-4 border-gray-200 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Botaani Animal — 30 mL</h3>
              <p className="text-gray-700 mb-3">
                A companion formula with Trace amounts of Δ9 THC in BP-grade glycerin. Measured dropper for consistent portions; start low, go slow, and consult your veterinarian.
              </p>
              <p className="text-sm text-gray-600 italic">
                Not a veterinary medicine. Statements not evaluated by SAHPRA. Not intended to diagnose, treat, cure, or prevent disease.
              </p>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Our promise</h2>
          <p className="text-gray-700 leading-relaxed">
            The world doesn't need more complicated products. It needs products made with care. From field to bottle, we choose the honest path—documented, tested, and thoughtfully packaged—so you can feel as confident using Botaani as we do when we share it with those closest to us.
          </p>
        </section>

        {/* Quick Facts */}
        <section className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick facts</h3>
          <div className="flex flex-wrap gap-4 text-gray-700">
            <span>Made in South Africa</span>
            <span>•</span>
            <span>GACP cultivation</span>
            <span>•</span>
            <span>GMP-licensed manufacturing</span>
            <span>•</span>
            <span>COAs for every batch</span>
            <span>•</span>
            <span>Typical SA delivery ~3 business days</span>
            <span>•</span>
            <span>Shelf life up to 2 years</span>
          </div>
        </section>
      </main>
        <Footer />
    </div>
  );
}
