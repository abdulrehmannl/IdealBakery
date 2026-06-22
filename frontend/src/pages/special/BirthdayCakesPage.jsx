import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Phone, MessageCircle, ChevronRight, Clock, Star } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard';

/**
 * BirthdayCakesPage
 * =================
 * Dedicated page for custom birthday cake orders.
 * Shows:
 *   1. Hero banner with how-to-order info
 *   2. Grid of birthday cake options (product cards)
 *   3. How-to-order steps section
 *
 * Route: /special/birthday-cakes
 */
function BirthdayCakesPage() {

    const [cakes, setCakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCakes = async () => {
            try {
                const res = await api.get('/api/products?tags=birthday-cake');
                if (res.data.success) {
                    setCakes(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch birthday cakes:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCakes();
    }, []);

    /*
     * How-to-order steps — shown as a simple 3-step guide below the product grid.
     * These steps explain the custom order process to the customer.
     */
    const steps = [
        {
            step: '01',
            title: 'Choose Your Design',
            description: 'Browse our designs above or describe your idea over WhatsApp.'
        },
        {
            step: '02',
            title: 'Place Your Order',
            description: 'Call us or WhatsApp at least 24 hours before your event.'
        },
        {
            step: '03',
            title: 'We Bake & Deliver',
            description: 'We bake fresh and deliver on your chosen date — right on time.'
        },
    ];

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: HERO BANNER
            ══════════════════════════════════════════ */}
            <div
                className="relative bg-primary text-white py-20 px-8 text-center overflow-hidden"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1400&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-primary/85 z-0" />

                <div className="relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-5">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/menu" className="hover:text-white transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-semibold">Birthday Cakes</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        🎂 Birthday Cakes
                    </h1>
                    <div className="w-16 h-1 bg-white/50 mx-auto mb-5 rounded-full" />
                    <p className="font-body text-white/85 max-w-lg mx-auto text-lg mb-8">
                        Custom-designed cakes made for your special day. Every cake is baked fresh and decorated by hand.
                    </p>

                    {/* Quick Contact Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {/* Call button */}
                        <a
                            href="tel:03234404773"
                            className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow-lg"
                        >
                            <Phone size={16} />
                            CALL TO ORDER
                        </a>
                        {/* WhatsApp button */}
                        <a
                            href="https://wa.me/923234404772"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded font-bold text-sm tracking-widest hover:bg-[#1EBE5B] transition-colors shadow-lg"
                        >
                            <MessageCircle size={16} />
                            WHATSAPP US
                        </a>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 2: NOTICE BAR
                Minimum order lead time notice
            ══════════════════════════════════════════ */}
            <div className="bg-[#1A1A1A] text-white py-3 px-8 text-center flex items-center justify-center gap-3">
                <Clock size={16} className="text-white/70 shrink-0" />
                <p className="font-body text-sm font-semibold tracking-wide">
                    Custom cake orders require <span className="text-secondary font-bold">at least 24 hours</span> advance notice. Call us to confirm availability.
                </p>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: CAKE OPTIONS GRID
            ══════════════════════════════════════════ */}
            <section className="py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-text-dark">
                            Our Birthday Cake Designs
                        </h2>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
                        <p className="font-body text-text-light mt-4 text-sm">
                            All cakes fully customizable — flavors, colors, size, and message.
                        </p>
                    </div>

                    {/*
                        Product grid — same 4-col responsive grid as category pages.
                        Uses the shared ProductCard component.
                    */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12 text-text-light">Loading cakes...</div>
                        ) : cakes.length > 0 ? (
                            cakes.map((cake) => (
                                <ProductCard 
                                    key={cake._id} 
                                    product={{
                                        id: cake._id,
                                        name: cake.name,
                                        description: cake.description,
                                        price: `From Rs. ${cake.price}`,
                                        image: cake.image || 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=contain&w=500&q=80',
                                        badge: cake.tags && cake.tags.length > 0 ? cake.tags[0].toUpperCase() : null
                                    }} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-text-light">No birthday cakes found.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 4: HOW TO ORDER — 3 STEPS
            ══════════════════════════════════════════ */}
            <section className="bg-primary text-white py-16 px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold mb-4">How to Place a Custom Order</h2>
                        <div className="w-12 h-1 bg-white/40 mx-auto rounded-full" />
                    </div>

                    {/* 3-column step grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        {steps.map((item) => (
                            <div key={item.step} className="flex flex-col items-center">
                                {/* Step number in a circle */}
                                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center mb-5">
                                    <span className="font-heading text-2xl font-bold text-white">{item.step}</span>
                                </div>
                                <h3 className="font-heading text-xl font-bold mb-3">{item.title}</h3>
                                <p className="font-body text-white/75 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Back to Menu */}
            <div className="py-10 text-center" style={{ backgroundColor: '#F5F0EB' }}>
                <Link
                    to="/menu"
                    className="inline-block border-2 border-primary text-primary px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-primary hover:text-white transition-colors"
                >
                    ← BACK TO FULL MENU
                </Link>
            </div>

        </div>
    );
}

export default BirthdayCakesPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Full special-order page with hero, notice bar, product grid, and how-to-order steps.
 *    - <a href="tel:..."> for direct phone calling from mobile.
 *    - <a href="https://wa.me/..."> WhatsApp deep link.
 * 2. Dynamic Data:
 *    - Fetched from GET /api/products?tags=birthday-cake
 *    - Phone number: 0323 4404773 (from the Branches data on homepage).
 * 3. Route: /special/birthday-cakes
 */
