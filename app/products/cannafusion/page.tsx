import ProductTemplate from '@/components/product-template';

export default function CannafusionPage() {
  return (
    <ProductTemplate
      id={94}
      title="Botaani Cannafusion"
      subtitle="Wellness Oil with THCa"
      price={1500}
      category="Cannafusion"
      image="/front-bottle.jpg"
      badges={['Vegan', '18+', '15ml']}
      slug="botaani-cannafusion"
      description={`Simple. Composed. Considered. Botaani Cannafusion is a glycerin-based wellness oil intended for adults who want a clean, minimal approach. Each 15 mL bottle contains trace elements of THCa, alkaloids, flavonoids and terpenes delivering a non-psychoactive* botanical infusion with an elegant, lightly sweet taste.

The texture is smooth and gentle, designed for everyday routines with clarity and ease. Used as directed, Cannafusion may assist with a sense of calm, everyday balance and general wellbeing—free from harsh additives, crafted in South Africa, and presented in premium Type III amber glass for freshness.

Pair with a steady lifestyle ritual: quiet mornings, focused afternoons, or evening wind-down. Minimal ingredients. Maximum intention.

*Non-psychoactive means it does not produce the "high" associated with THC. Always consult with a healthcare provider before use, especially if taking medications or if you are pregnant or nursing.`}
      ingredients={[
        'Glycerin base',
        'THCa extract',
        'Alkaloids',
        'Flavonoids',
        'Terpenes',
        'No artificial additives'
      ]}
      benefits={[
        'Non-psychoactive botanical infusion',
        'May assist with sense of calm',
        'Supports everyday balance',
        'Clean, minimal formulation'
      ]}
      faqs={[
        {
          question: 'Is Cannafusion psychoactive?',
          answer: 'No. Cannafusion is non-psychoactive, meaning it does not produce the "high" associated with THC. It contains THCa, which is the raw, non-activated form.'
        },
        {
          question: 'How should I use it?',
          answer: 'Use as directed on the label. Most people take it sublingually (under the tongue) or add it to food/beverages. Start with a small amount and adjust to your preference.'
        },
        {
          question: 'Will it show up on a drug test?',
          answer: 'THCa is the raw form of THC and typically does not activate in the body. However, if you are subject to drug testing, consult with your healthcare provider or the testing facility.'
        },
        {
          question: 'Is it legal?',
          answer: 'Cannafusion is legal in South Africa and complies with local regulations. Always check your local laws before use.'
        },
        {
          question: 'Can I use it with medications?',
          answer: 'Consult with your healthcare provider before use, especially if you are taking medications, are pregnant, nursing, or have any health conditions.'
        },
        {
          question: 'How should I store it?',
          answer: 'Store in a cool, dark place away from direct sunlight. The premium Type III amber glass protects the formula. Once opened, use within 12 months.'
        }
      ]}

    />
  );
}