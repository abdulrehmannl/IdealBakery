import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Phone, MessageCircle, ChevronRight, Users, CheckCircle } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard';

/**
 * EventOrdersPage
 * ===============
 * Dedicated page for bulk event and catering orders.
 * Shows catering packages and platters, plus a simple how-it-works guide.
 *
 * Route: /special/event-orders
 */
function EventOrdersPage() {

    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await api.get('/api/products?tags=event-order');
                if (res.data.success) {
                    setPackages(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch event orders:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);

    /*
     * Key points / guarantees for event orders.
     * Displayed as a checklist to build trust with the customer.
     */
    const guarantees = [
        'Fresh food guaranteed — baked within 12 hours of delivery',
        'On-time delivery for your event — we never miss a deadline',
        'Custom quantities — we scale up for any event size',
        'Dedicated event coordinator for orders above Rs. 20,000',
        'Setup assistance available on request',
    ];

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: HERO BANNER
            ══════════════════════════════════════════ */}
            <div
                className="relative bg-primary text-white py-20 px-8 text-center overflow-hidden"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-primary/85 z-0" />
                <div className="relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-5">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/menu" className="hover:text-white transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-semibold">Event Orders</span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        🎉 Event Orders
                    </h1>
                    <div className="w-16 h-1 bg-white/50 mx-auto mb-5 rounded-full" />
                    <p className="font-body text-white/85 max-w-lg mx-auto text-lg mb-8">
                        Bulk catering orders for weddings, Mehndi, corporate events, and parties. We handle every detail so you don't have to.
                    </p>

                    {/* Contact buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="tel:03234404773"
                            className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow-lg"
                        >
                            <Phone size={16} />
                            CALL TO ORDER
                        </a>
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
            ══════════════════════════════════════════ */}
            <div className="bg-[#1A1A1A] text-white py-3 px-8 text-center flex items-center justify-center gap-3">
                <Users size={16} className="text-white/70 shrink-0" />
                <p className="font-body text-sm font-semibold tracking-wide">
                    Event orders require <span className="text-secondary font-bold">at least 48 hours</span> advance notice. For large events, please book 3–5 days ahead.
                </p>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: CATERING PACKAGES GRID
            ══════════════════════════════════════════ */}
            <section className="py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-text-dark">
                            Catering Packages
                        </h2>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
                        <p className="font-body text-text-light mt-4 text-sm">
                            All packages can be customized. Call us for a tailored quote for your event.
                        </p>
                    </div>

                    {/* Product grid — 3 columns for 6 items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12 text-text-light">Loading packages...</div>
                        ) : packages.length > 0 ? (
                            packages.map((pkg) => (
                                <ProductCard 
                                    key={pkg._id} 
                                    product={{
                                        id: pkg._id,
                                        name: pkg.name,
                                        description: pkg.description,
                                        price: `Rs. ${pkg.price}`,
                                        image: pkg.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=contain&w=500&q=80',
                                        badge: pkg.tags && pkg.tags.length > 0 ? pkg.tags[0].toUpperCase() : null
                                    }} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-text-light">No catering packages found.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 4: OUR GUARANTEES
                Checklist of promises for event customers
            ══════════════════════════════════════════ */}
            <section className="bg-primary text-white py-14 px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="font-heading text-3xl font-bold mb-4">Our Event Promise</h2>
                        <div className="w-12 h-1 bg-white/40 mx-auto rounded-full" />
                    </div>

                    {/* Guarantee checklist */}
                    <div className="space-y-4">
                        {guarantees.map((guarantee, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <CheckCircle size={20} className="shrink-0 mt-0.5 text-white/80" />
                                <p className="font-body text-white/90 text-base">{guarantee}</p>
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="mt-10 text-center">
                        <a
                            href="https://wa.me/923234404772"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow-xl"
                        >
                            <MessageCircle size={18} />
                            GET A CUSTOM QUOTE ON WHATSAPP
                        </a>
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

export default EventOrdersPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Special order page with a guarantees checklist section.
 *    - CheckCircle icon from lucide-react to make guarantees visually appealing.
 *    - WhatsApp deep link (wa.me) for easy contact on mobile.
 * 2. Dynamic Data: Fetched from GET /api/products?tags=event-order
 * 3. Route: /special/event-orders
 * 4. Future API: POST /api/orders for event order submissions.
 */
