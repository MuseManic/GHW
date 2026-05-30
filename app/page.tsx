import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer'
import Slider from '@/components/slider';
import ItemContainer from '@/components/item-container';

export default function Home() {
    const sliderImages = [
        {
            src: '/images/hero1.png',
            alt: 'Hero slide one',
            title: 'Moving forward',
            description: 'We are here to help you move forward'
        },
        {
            src: '/images/hero2.png',
            alt: 'Hero slide two',
            title: 'Ground Focused',
            description: 'Get the natural supplements you need'
        },
        {
            src: '/images/hero3.png',
            alt: 'Hero slide three',
            title: 'Another Title here',
            description: 'another description should you need it'
        },
    ];

    return (
           <main
            className="bg-fixed bg-center bg-cover"
            style={{ 
                
                
                // backgroundImage: "url('/drip.jpg')"
                backgroundColor: 'var(--white)'
            
            
            }}
        >
            <NavBar />
            <Slider images={sliderImages} />
            
            {/* Item Container */}
            <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Featured Products</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ItemContainer
                    image="/Cannafusion-ext.jpeg"
                    title="Botaani Cannafusion"
                    description="Find Your Center with Botaani. Elevate your daily ritual with Cannafusion—a premium, glycerin-based wellness oil that whispers rather than shouts. Each drop delivers a smooth, non-psychoactive botanical infusion to help you navigate your day with calm and composure. From quiet mornings to evening wind-downs, it’s the minimal approach to maximum wellbeing."
                    price={1500}
                />
                <ItemContainer
                    image="/Serum.jpeg"
                    title="Botaani Serum"
                    description="Radiance, Refined. A few silky drops are all it takes for your skin to remember how to glow. This featherlight restorative oil cushions your complexion in Jojoba, Rosehip, and Olive Squalane, mimicking your skin’s natural touch for instant, breathable comfort. Infused with our signature Cannafusion and calming Lavender, it’s more than skincare—it’s a moment of botanical clarity."
                    price={799}
                />
                <ItemContainer
                    image="/face.png"
                    title="Botaani Face"
                    description="A Sigh of Relief for Your Skin. Melt into moisture that feels like a quiet exhale. Botaani Face is a daily calming cream designed to soften, support, and soothe your skin’s natural barrier. Infused with our signature Cannafusion and a botanical veil of Lavender and Tea Tree, it gently erases the day’s stress."
                    price={699}
                />
                <ItemContainer
                    image="/bod.jpeg"
                    title="Botaani Body"
                    description="Your Daily Wrap of Quiet Luxury. Transform your post-shower routine into a moment of pure restoration. This weightless, all-over hydrator glides on like silk, leaving skin supple, satiny, and deeply comforted from neck to toe. Infused with our signature Cannafusion and a radiant bouquet of Neroli and Rose, it settles the senses while Carrot Root oil nurtures a velvety glow."
                    price={499}
                />
                </div>
                
            </div>

            
            
            
            <Footer />
        </main>
    )
}
