import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer'
import Slider from '@/components/slider';
import ItemContainer from '@/components/item-container';

export default function Home() {
    const sliderImages = [
        {
            src: '/images/slider5.jpg',
            alt: 'Slider One',
            title: 'Moving forward',
            description: 'We are here to help you move forward'
        },
        // {
        //     src: '/images/slider2.jpg',
        //     alt: 'Slider Two',
        //     title: 'Ground Focused',
        //     description: 'Get the natural supplements you need'
        // },
        {
            src: '/images/slider3.jpg',
            alt: 'Slider Three',
            title: 'Another Title here',
            description: 'another description should you need it'
        },
            {
            src: 'sliderTwo.jpg',
            alt: 'Slider Four',
            title: 'Moving forward',
            description: 'We are here to help you move forward'
        },
        {
            src: '/images/slider1.jpg',
            alt: 'Slider Five',
            title: 'Ground Focused',
            description: 'Get the natural supplements you need'
        }

    ];

    return (
           <main
            className="bg-fixed bg-center bg-cover"
            style={{ backgroundImage: "url('/drip.jpg')" }}
        >
            <NavBar />
            <Slider images={sliderImages} />
            
            {/* Item Container */}
            <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Featured Products</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                <ItemContainer
                    image="/front-bottle.jpg"
                    title="Botaani Cannafusion"
                    description="Simple. Composed. Considered. Botaani Cannafusion is a glycerin-based wellness oil intended for adults who want a clean, minimal approach. Each 15 mL bottle contains trace elements of THCa, alkaloids, flavonoids and terpenes delivering a non-psychoactive* botanical infusion with an elegant, lightly sweet taste. The texture is smooth and gentle, designed for everyday routines with clarity and ease. Used as directed, Cannafusion may assist with a sense of calm, everyday balance and general wellbeing—free from harsh additives, crafted in South Africa, and presented in premium Type III amber glass for freshness. Pair with a steady lifestyle ritual: quiet mornings, focused afternoons, or evening wind-down. Minimal ingredients. Maximum intention."
                    price={1500}
                />
                <ItemContainer
                    image="/serum.jpg"
                    title="Botaani Serum"
                    description="A few silky drops, and your skin remembers how to glow. Botaani Serum is a featherlight restorative oil intended to cushion, replenish and refine for a luminous, healthy‑looking complexion. Jojoba and Olive squalane mimic skin's natural lipids for fast‑absorbing comfort, while Rosehip oil and Vitamin E help protect from everyday dryness. Our non‑psychoactive Botaani Cannafusion weaves through the blend for a composed, well‑balanced feel. Calming notes of Lavender and Geranium complete the experience with soft, botanical clarity. The texture is beautifully sheer—no greasiness, just a breathable glow that layers effortlessly under sunscreen or makeup. With consistent use, skin may look more even, feel smoother to the touch, and appear visibly refreshed. May assist with the look of fine, dry lines, the feel of dehydration after cleansing, and restoring a dewy finish to combination or balanced skin types. Intended for daily use morning and/or night as the finishing step before moisturiser—or alone on minimal days"
                    price={799}
                />
                <ItemContainer
                    image="/face.png"
                    title="Botaani Face"
                    description="Melt into moisture that feels like a sigh of relief. Botaani Face is a daily calming cream intended to hydrate, soften and support the look of a healthy skin barrier. A gentle natural aqueous cream base cushions the skin, leaving it feeling smooth and comforted. Our signature Botaani Cannafusion lends a soothing touch, and an elegant trio of Lavender, Tea Tree and Geranium oils envelops skin in a clean, botanical veil. Carrot seed oil completes the blend with a nurtured, well‑rested appearance. The texture sinks in without heaviness, making it ideal morning or night under makeup or on its own. With regular use, skin may appear more even, less reactive and visibly replenished—balanced moisture where you need it most and a soft, natural glow. Intended for normal, combination and sensitive‑leaning skin that craves steady, uncomplicated care.
                     May assist with the look of redness, the feel of dryness, and the appearance of occasional blemishes, while promoting a relaxed, conditioned complexion."
                    price={699}
                />
                <ItemContainer
                    image="/body.jpg"
                    title="Botaani Body"
                    description="Wrap your body in quiet luxury. Botaani Body is an everyday, all‑over hydrator intended to leave skin feeling supple, satiny and comfortably moisturised from neck to toes. A weightless natural aqueous cream base glides on, while Olive oil imparts lasting softness without the heavy residue. Our non‑psychoactive Botaani Cannafusion brings a calm, cared‑for feel to post‑shower skin. A radiant bouquet of Neroli, Rose blend and a lift of Lemon adds a fresh, uplifting finish, as Lavender settles the senses and Carrot root oil supports a nurtured look. The result is skin that looks smoother and feels velvety—easy to wear every day, quick to absorb, and suitable for the whole family. May assist with the feel of dryness and tightness after bathing, the look of dullness on arms and legs, and maintaining a soft, touchable sheen through the day. Intended as your simple ritual for instantly comfortable, beautifully conditioned skin."
                    price={499}
                />
                </div>
                
            </div>

            
            
            
            <Footer />
        </main>
    )
}
