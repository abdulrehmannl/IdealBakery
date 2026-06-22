import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Phone, MessageCircle, ChevronRight, Clock, Gift } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard';

/**
 * GiftBoxesPage
 * =============
 * Dedicated page for custom gift box orders.
 * Shows beautifully packaged gift box options with products inside.
 *
 * Route: /special/gift-boxes
 */
function GiftBoxesPage() {

    const [giftBoxes, setGiftBoxes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGiftBoxes = async () => {
            try {
                const res = await api.get('/api/products?tags=gift-box');
                if (res.data.success) {
                    setGiftBoxes(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch gift boxes:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGiftBoxes();
    }, []);

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: HERO BANNER
            ══════════════════════════════════════════ */}
            <div
                className="relative bg-primary text-white py-20 px-8 text-center overflow-hidden"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=80)',
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
                        <span className="text-white font-semibold">Gift Boxes</span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        🎁 Gift Boxes
                    </h1>
                    <div className="w-16 h-1 bg-white/50 mx-auto mb-5 rounded-full" />
                    <p className="font-body text-white/85 max-w-lg mx-auto text-lg mb-8">
                        The perfect sweet surprise for loved ones. Beautifully packaged, lovingly filled, thoughtfully gifted.
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
                <Gift size={16} className="text-white/70 shrink-0" />
                <p className="font-body text-sm font-semibold tracking-wide">
                    Free ribbon & card included with every gift box! Custom message available on request.
                </p>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: GIFT BOX OPTIONS GRID
            ══════════════════════════════════════════ */}
            <section className="py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-text-dark">
                            Choose Your Gift Box
                        </h2>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
                        <p className="font-body text-text-light mt-4 text-sm">
                            All boxes include complimentary wrapping, a ribbon, and a personalized message card.
                        </p>
                    </div>

                    {/* Product grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {/*
                         * Using 3 columns here (instead of 4) because there are only 6 items
                         * and gift boxes look better with slightly larger cards.
                         */}
                        {isLoading ? (
                            <div className="col-span-full text-center py-12 text-text-light">Loading gift boxes...</div>
                        ) : giftBoxes.length > 0 ? (
                            giftBoxes.map((box) => (
                                <ProductCard 
                                    key={box._id} 
                                    product={{
                                        id: box._id,
                                        name: box.name,
                                        description: box.description,
                                        price: `Rs. ${box.price}`,
                                        image: box.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=contain&w=500&q=80',
                                        badge: box.tags && box.tags.length > 0 ? box.tags[0].toUpperCase() : null
                                    }} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-text-light">No gift boxes found.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 4: "Why Gift From Us" PERKS
            ══════════════════════════════════════════ */}
            <section className="bg-primary text-white py-14 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-bold mb-4">Why Gift Super Ideal?</h2>
                    <div className="w-12 h-1 bg-white/40 mx-auto mb-10 rounded-full" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Perk 1 */}
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4">🎀</span>
                            <h3 className="font-heading text-lg font-bold mb-2">Elegant Packaging</h3>
                            <p className="font-body text-white/75 text-sm">Premium ribbon-tied boxes — presentable straight from the bag.</p>
                        </div>
                        {/* Perk 2 */}
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4">✍️</span>
                            <h3 className="font-heading text-lg font-bold mb-2">Custom Message</h3>
                            <p className="font-body text-white/75 text-sm">Add a handwritten or printed message card free of charge.</p>
                        </div>
                        {/* Perk 3 */}
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-4">🏠</span>
                            <h3 className="font-heading text-lg font-bold mb-2">Home Delivery</h3>
                            <p className="font-body text-white/75 text-sm">We deliver directly to your recipient's address across Sahiwal.</p>
                        </div>
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

export default GiftBoxesPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Full special-order page with hero, notice bar, product grid, and perks section.
 *    - 3-column grid (lg:grid-cols-3) since only 6 items — better visual balance than 4-col.
 * 2. Dynamic Data: Fetched from GET /api/products?tags=gift-box
 * 3. Route: /special/gift-boxes
 */
