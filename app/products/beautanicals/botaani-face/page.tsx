import ProductTemplate from '@/components/product-template';

export default function FacePage() {
  return (
    <ProductTemplate
      id={816}
      title="Botaani Face"
      subtitle="Calming Hydration Cream"
      image="/face.png"
      price={699}
      category="Beautanicals → Face"
      badges={['Vegan', 'Cruelty-free', 'Lightweight', '100ml']}
      slug="botaani-face"
      description={`Melt into moisture that feels like a sigh of relief. Botaani Face is a daily calming cream intended to hydrate, soften and support the look of a healthy skin barrier. A gentle natural aqueous cream base cushions the skin, leaving it feeling smooth and comforted.

Our signature Botaani Cannafusion lends a soothing touch, and an elegant trio of Lavender, Tea Tree and Geranium oils envelops skin in a clean, botanical veil. Carrot seed oil completes the blend with a nurtured, well-rested appearance.

The texture sinks in without heaviness, making it ideal morning or night under makeup or on its own. With regular use, skin may appear more even, less reactive and visibly replenished—balanced moisture where you need it most and a soft, natural glow.

Intended for normal, combination and sensitive-leaning skin that craves steady, uncomplicated care. May assist with the look of redness, the feel of dryness, and the appearance of occasional blemishes, while promoting a relaxed, conditioned complexion.`}
      ingredients={[
        'Natural aqueous cream base',
        'Botaani Cannafusion',
        'Essential oils: Lavender, Tea Tree, Geranium',
        'Carrot seed oil'
      ]}
      benefits={[
        'Lightweight, non-greasy formula',
        'Supports healthy skin barrier',
        'Calming essential oils blend',
        'Suitable for sensitive skin'
      ]}
      faqs={[
        {
          question: 'Which skin types is it for?',
          answer: 'Intended for normal, combination and sensitive-leaning skin that wants calm, comfortable hydration.'
        },
        {
          question: 'Will it feel heavy or greasy?',
          answer: 'No. The natural aqueous base is lightweight and designed to absorb quickly without a residue.'
        },
        {
          question: 'Where does it go in my routine?',
          answer: 'Apply after cleansing and water-based serums. In the day, follow with SPF.'
        },
        {
          question: 'Can it be used with actives (AHA/BHA/retinoids/vitamin C)?',
          answer: 'Yes—introduce slowly and patch test first. If using strong actives, apply this cream after them to buffer.'
        },
        {
          question: 'Is there fragrance?',
          answer: 'Only a light botanical scent from essential oils (lavender, tea tree, geranium). No added synthetic perfume.'
        },
        {
          question: 'Shelf life and storage?',
          answer: 'Store cool and out of direct sun. Check the batch expiry on pack; once opened, aim to use within 12 months.'
        }
      ]}
    />
  );
}
