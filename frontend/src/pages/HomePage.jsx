import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import Categories from '../components/home/Categories';
import Bestsellers from '../components/home/Bestsellers';
import OffersSection from '../components/home/OffersSection';
import SpecialOrders from '../components/home/SpecialOrders';
import DeliveryBanner from '../components/home/DeliveryBanner';
import WhyChooseUs from '../components/home/WhyChooseUs';
import MarqueeTicker from '../components/home/MarqueeTicker';
import Branches from '../components/home/Branches';

/**
 * HomePage Component
 * Assembles all the individual sections of the home page.
 */
function HomePage() {
    return (
        <div className="w-full flex flex-col font-body">
            {/* Sections 1, 2 & 10 are global elements (Announcement, Navbar, Footer) handled in App.jsx */}
            
            {/* 3. Auto-sliding hero carousel */}
            <HeroCarousel />
            
            {/* 4. Main Category showcase */}
            <Categories />
            
            {/* 5. Top selling product cards */}
            <Bestsellers />
            
            {/* NEW: Current Offers & Deals Section */}
            <OffersSection />
            
            {/* 6. Special/custom orders showcase */}
            <SpecialOrders />
            
            {/* NEW: Delivery CTA Banner */}
            <DeliveryBanner />
            
            {/* 7. Brand features/promises */}
            <WhyChooseUs />
            
            {/* 9. Physical store locations */}
            <Branches />
        </div>
    )
}

export default HomePage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Component Composition: Building a complex page using smaller, focused React components.
 * 2. Data source:
 *    - All sections pull data from backend APIs or subcomponents that fetch.
 * 3. Future integrations:
 *    - Auth state should hide/show the 'Create an Account' banner if the user is already logged in.
 * 4. Performance considerations:
 *    - This page orchestrates layout but delegates state (like carousel state) to children.
 *    - Consider React.lazy() for loading components lower down the page (like Branches) if they become heavy later.
 */