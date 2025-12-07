import ProductTemplate from '@/components/product-template';

export default function SerumPage() {
  return (
    <>
      <head>
        <title>Botaani Serum — Lightweight Restorative Oil | Botaani</title>
        <meta name="description" content="Featherlight facial oil that may assist with glow, softness and smoothness. Fast-absorbing, vegan, cruelty-free. Shop Botaani Serum in South Africa." />
        <meta name="keywords" content="serum, glow, lightweight oil, hydration, vegan, cruelty-free" />
        <meta property="og:type" content="product" />
        <meta property="og:title" content="Botaani Serum — Lightweight Restorative Oil" />
        <meta property="og:description" content="Featherlight oil that may assist with glow and softness." />
        <meta property="og:image" content="https://yourdomain/img/pdp/serum-1200x630.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Botaani Serum — Lightweight Restorative Oil" />
        <meta name="twitter:description" content="Featherlight oil for glow and softness." />
      </head>

      <ProductTemplate
        id={810}
        title="Botaani Serum"
        subtitle="Lightweight Restorative Oil"
        price={799}
        category="Beautanicals → Serum"
        image="/serum.jpg"
        badges={['Vegan', 'Cruelty-free', 'Lightweight', '20ml']}
        slug="botaani-serum"
        description={`A few silky drops, and your skin remembers how to glow. Botaani Serum is a featherlight restorative oil intended to cushion, replenish and refine for a luminous, healthy-looking complexion. Jojoba and Olive squalane mimic skin's natural lipids for fast-absorbing comfort, while Rosehip oil and Vitamin E help protect from everyday dryness.

Our non-psychoactive Botaani Cannafusion weaves through the blend for a composed, well-balanced feel. Calming notes of Lavender and Geranium complete the experience with soft, botanical clarity.

The texture is beautifully sheer—no greasiness, just a breathable glow that layers effortlessly under sunscreen or makeup. With consistent use, skin may look more even, feel smoother to the touch, and appear visibly refreshed.

May assist with the look of fine, dry lines, the feel of dehydration after cleansing, and restoring a dewy finish to combination or balanced skin types. Intended for daily use morning and/or night as the finishing step before moisturiser—or alone on minimal days.`}
        ingredients={[
          'Jojoba oil',
          'Olive squalane',
          'Rosehip oil',
          'Vitamin E',
          'Essential oils: Lavender, Geranium',
          'Botaani Cannafusion',
          'Vegan, cruelty-free'
        ]}
        benefits={[
          'Featherlight, non-greasy texture',
          'Restores skin luminosity',
          'Smooths fine lines appearance',
          'Layers beautifully under makeup'
        ]}
        faqs={[
          {
            question: 'How do I use it (and how much)?',
            answer: 'After cleansing and water-based steps, apply 2–3 drops to damp or dry skin. Layer under or over your cream.'
          },
          {
            question: 'Will it make me break out?',
            answer: 'The base oils (jojoba, olive squalane, rosehip) are lightweight. Patch test first—skin is unique.'
          },
          {
            question: 'AM or PM? Makeup friendly?',
            answer: 'Both. It layers cleanly and plays well under sunscreen and makeup—allow a minute to settle.'
          },
          {
            question: 'Is it vegan and cruelty-free?',
            answer: 'Yes—vegan and cruelty-free.'
          },
          {
            question: 'Is there fragrance?',
            answer: 'Only light botanicals (lavender, geranium). No heavy perfume added.'
          },
          {
            question: 'How long to see results?',
            answer: 'A dewy feel is immediate; visible improvements in texture/radiance typically show over 2–4 weeks with consistent use (results vary).'
          }
        ]}
      />
    </>
  );
}
