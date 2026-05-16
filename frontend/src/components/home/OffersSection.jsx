import React from 'react';
import { Link } from 'react-router-dom';

function OffersSection() {
    // Dummy data matching Discount schema
    const offers = [
        {
            id: 1,
            title: "Weekend Special",
            discountType: 'percentage',
            value: 20,
            product: "Assorted Premium Mithai Box",
            originalPrice: 2000,
            discountedPrice: 1600,
            endDate: new Date("2026-04-10T23:59:59"),
            isActive: true,
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            title: "Happy Hour Deal",
            discountType: 'flat',
            value: 300,
            product: "Large Black Forest Cake",
            originalPrice: 2500,
            discountedPrice: 2200,
            endDate: new Date("2026-04-15T23:59:59"),
            isActive: true,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            title: "Combo Offer",
            discountType: 'percentage',
            value: 15,
            product: "Zinger Burger & Fries Combo",
            originalPrice: 850,
            discountedPrice: 722,
            endDate: new Date("2026-04-20T23:59:59"),
            isActive: true,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
        }
    ];

    return (
        <section className="bg-secondary py-20 px-8 border-t border-border/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-dark tracking-wide">
                        Current Offers & Deals
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 mb-6 rounded-full"></div>
                    <p className="font-body text-text-light max-w-2xl mx-auto text-lg">
                        Don't miss out on our limited time offers and seasonal promotions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div 
                            key={offer.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative group border border-border/50"
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4 bg-[#8B1A1A] text-white px-3 py-1.5 rounded text-sm font-bold tracking-widest z-10 shadow-lg">
                                {offer.discountType === 'percentage' ? `${offer.value}% OFF` : `Rs. ${offer.value} OFF`}
                            </div>

                            <div className="h-56 overflow-hidden relative">
                                <img 
                                    src={offer.image} 
                                    alt={offer.product}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 right-4 font-heading font-bold text-xl text-white">
                                    {offer.title}
                                </h3>
                            </div>

                            <div className="p-6 flex flex-col flex-1 bg-white border border-t-0 border-[#D4C5B0]/40 rounded-b-2xl">
                                <h4 className="font-body font-bold text-lg text-text-dark mb-2">
                                    {offer.product}
                                </h4>
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="font-body text-gray-400 line-through text-sm">
                                        Rs. {offer.originalPrice}
                                    </span>
                                    <span className="font-body font-bold text-2xl text-primary">
                                        Rs. {offer.discountedPrice}
                                    </span>
                                </div>

                                <div className="text-xs text-text-light mb-6 flex items-center gap-1 font-semibold tracking-wide">
                                    Valid until: <span className="text-text-dark">{offer.endDate.toLocaleDateString()}</span>
                                </div>

                                <div className="mt-auto">
                                    <Link 
                                        to="/menu" 
                                        className="block w-full text-center bg-primary text-white py-3 rounded font-bold tracking-widest text-sm hover:bg-[#6A1414] transition-colors"
                                    >
                                        GRAB DEAL
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OffersSection;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Component encapsulates promotional offers mapping to Discount database schema.
 *    - Hover lift effects (hover:-translate-y-2) for interactive UI.
 * 2. Dummy Data:
 *    - Data structure closely mimics MongoDB Discount schema (discountType, value, originalPrice, discountedPrice, isActive).
 * 3. Future API Replacement points:
 *    - The `offers` array should be populated via a `useEffect` hook fetching the backend API endpoint for active discounts.
 * 4. Design Note:
 *    - Badge background is strictly #8B1A1A with white text.
 */
