import ProductTemplate from '@/components/product-template';

export default function BodyPage() {
  return (
    <ProductTemplate
      id={817}
      title="Botaani Body"
      subtitle="Everyday All-Over Hydrator"
      price={499}
      image={"/body.jpg"}
      category="Beautanicals → Body"
      badges={['Vegan', 'Cruelty-free', 'Lightweight', '100ml']}
      slug="botaani-body"
      description={`Wrap your body in quiet luxury. Botaani Body is an everyday, all-over hydrator intended to leave skin feeling supple, satiny and comfortably moisturised from neck to toes. A weightless natural aqueous cream base glides on, while Olive oil imparts lasting softness without the heavy residue.
      
Our non-psychoactive Botaani Cannafusion brings a calm, cared-for feel to post-shower skin. A radiant bouquet of Neroli, Rose blend and a lift of Lemon adds a fresh, uplifting finish, as Lavender settles the senses and Carrot root oil supports a nurtured look.

The result is skin that looks smoother and feels velvety—easy to wear every day, quick to absorb, and suitable for the whole family. May assist with the feel of dryness and tightness after bathing, the look of dullness on arms and legs, and maintaining a soft, touchable sheen through the day.

Intended as your simple ritual for instantly comfortable, beautifully conditioned skin.`}
      ingredients={[
        'Natural aqueous cream base',
        'Olive oil',
        'Botaani Cannafusion',
        'Essential oils: Neroli, Rose, Lemon, Lavender',
        'Carrot root oil'
      ]}
      benefits={[
        'Lightweight, fast-absorbing formula',
        'Leaves skin soft and velvety',
        'Uplifting botanical scent',
        'Suitable for the whole family'
      ]}
      faqs={[
        {
          question: 'When should I apply it?',
          answer: 'Best applied immediately after showering or bathing to damp skin for optimal absorption.'
        },
        {
          question: 'Is it suitable for all skin types?',
          answer: 'Yes. The lightweight formula works for all skin types, from dry to combination.'
        },
        {
          question: 'Can children use it?',
          answer: 'Yes. It\'s gentle and suitable for the whole family, including children.'
        },
        {
          question: 'How long does a bottle last?',
          answer: 'A little goes a long way. Most people find one bottle lasts 2-3 months with daily use.'
        },
        {
          question: 'Does it have a strong scent?',
          answer: 'It has a light, fresh botanical scent from the essential oils. Not overpowering, just uplifting.'
        },
        {
          question: 'Storage instructions?',
          answer: 'Store in a cool place away from direct sunlight. Once opened, use within 12 months.'
        }
      ]}
    />
  );
}
