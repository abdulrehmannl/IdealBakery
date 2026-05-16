import React from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

function DeliveryBanner() {
    return (
        <section className="bg-card-bg py-12 px-8 w-full border-y border-border/50 shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                
                {/* Left Side: Text Content */}
                <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4 border border-primary/20">
                        FAST DELIVERY
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-dark mb-4 leading-tight">
                        We Bring Freshness <br className="hidden md:block" /> To Your Doorstep
                    </h2>
                    <p className="font-body text-text-light mb-8 max-w-md text-lg leading-relaxed">
                        Order online and get your favorite bakery items delivered fresh to your home. Available across Sahiwal.
                    </p>
                    <Link to="/menu" className="bg-primary text-white px-8 py-4 rounded font-bold tracking-widest text-sm hover:bg-[#6A1414] transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                        ORDER NOW
                    </Link>
                </div>

                {/* Right Side: Icon */}
                <div className="flex-1 flex justify-center md:justify-end opacity-90 hover:opacity-100 transition-opacity">
                    <Truck size={200} strokeWidth={0.8} color="#8B1A1A" className="drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                </div>

            </div>
        </section>
    );
}

export default DeliveryBanner;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Full width call-to-action banner split into Flexbox row layout.
 *    - Lucide React icon used prominently as an illustration rather than simple icon.
 * 2. Visual Design:
 *    - Uses #F5F0EB for warm cream background.
 *    - Red primary (#8B1A1A) for the Truck icon and buttons.
 */
