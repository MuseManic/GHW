

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Contact Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                            <div className="flex flex-col gap-2">
                                <a href="/info/terms#contact" className="text-gray-300 hover:text-white transition">
                                    Contact Us
                                </a>
                                <a href="/info/terms#terms" className="text-gray-300 hover:text-white transition">
                                    Returns
                                </a>
                            </div>
                        </div>
                        
                        {/* Information Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Information</h2>
                            <ul className="space-y-2">
                                <li><a href="/info/about-us" className="text-gray-300 hover:text-white transition">About Us</a></li>
                                <li><a href="/info/terms#delivery" className="text-gray-300 hover:text-white transition">Delivery Information</a></li>
                                <li><a href="/info/terms#privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                        
                        {/* Extras Section */}
                        {/* <div>
                            <h2 className="text-xl font-bold mb-4">Extras</h2>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition">Gift Certificates</a></li>
                            </ul>
                        </div>
                         */}
                        {/* Social Media Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Social Media</h2>
                            <div className="flex flex-col gap-2">
                                <a href="https://www.instagram.com/botaani_za/" className="text-gray-300 hover:text-white transition">
                                    Instagram
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61583654447207#" className="text-gray-300 hover:text-white transition">
                                    Facebook
                                </a>
                                {/* <a href="#" className="text-gray-300 hover:text-white transition">
                                    Whatsapp
                                </a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Copyright Section with Background */}
            <div 
                className="w-full py-6 px-6 text-left"
              style={{
                backgroundImage: "url('/images/Botaani-26.jpg')",
                backgroundSize: '500%',      
                backgroundPosition: 'top right',
                backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <p className="text-white font-semibold">&copy; {new Date().getFullYear()} Botaani. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}