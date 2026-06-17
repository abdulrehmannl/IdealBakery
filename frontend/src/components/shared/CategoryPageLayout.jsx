import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * CategoryPageLayout Component (Shared Layout for all 6 category pages)
 * =========================================================================
 * This layout is used by ALL six category pages to keep the design consistent.
 * It renders:
 *   1. A maroon (#8B1A1A) hero banner with breadcrumb, title, divider, and description
 *   2. A responsive product grid using the shared <ProductCard /> component
 *
 * Props:
 *   categoryName: string     — e.g., "Fast Food", "Bakery Items"
 *   description:  string     — short subtitle shown below the category name
 *   products:     array      — array of product objects (see ProductCard for expected shape)
 *   bgImage:      string     — optional URL for a background image in the hero banner
 */
function CategoryPageLayout({ categoryName, description, products, bgImage }) {
    return (
        // min-h-screen ensures the page fills the viewport even with few products
        <div className="min-h-screen" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: HERO BANNER
                Maroon background with breadcrumb + title
            ══════════════════════════════════════════ */}
            <div
                className="relative bg-primary text-white py-20 px-8 text-center overflow-hidden"
                style={
                    // If a background image is provided, use it with a dark overlay
                    bgImage
                        ? {
                              backgroundImage: `url(${bgImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                          }
                        : {}
                }
            >
                {/* Dark overlay — only shows when a bg image is present */}
                {bgImage && (
                    <div className="absolute inset-0 bg-primary/80 z-0" />
                )}

                {/* All text content sits above the overlay */}
                <div className="relative z-10">

                    {/* Breadcrumb navigation: Home → Menu → CategoryName */}
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-5 font-body">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/menu" className="hover:text-white transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        {/* Current page — shown in full white (active state) */}
                        <span className="text-white font-semibold">{categoryName}</span>
                    </div>

                    {/* Page Title — Playfair Display heading */}
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        {categoryName}
                    </h1>

                    {/* Decorative divider line below title */}
                    <div className="w-16 h-1 bg-white/50 mx-auto mb-5 rounded-full" />

                    {/* Category description subtitle */}
                    <p className="font-body text-white/80 max-w-lg mx-auto text-lg">
                        {description}
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 2: PRODUCTS GRID
                Responsive 4-column → 2-column → 1-column
            ══════════════════════════════════════════ */}
            <section className="py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Products count info */}
                    <p className="font-body text-text-light text-sm mb-8 text-center tracking-wide">
                        Showing <span className="font-bold text-text-dark">{products.length}</span> items
                    </p>

                    {/*
                        Product grid:
                        - 4 columns on large screens (lg:grid-cols-4)
                        - 2 columns on tablets (sm:grid-cols-2)
                        - 1 column on mobile (default)
                        - items-stretch makes all cards in a row the same height
                    */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                        {/*
                            TODO — FUTURE API INTEGRATION:
                            Replace this `products` array with data fetched from:
                            GET /api/products?category=<categoryId>
                            using axios inside a useEffect() hook in the parent page.
                        */}
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Back to Menu link */}
                    <div className="mt-16 text-center">
                        <Link
                            to="/menu"
                            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-primary hover:text-white transition-colors"
                        >
                            ← BACK TO FULL MENU
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default CategoryPageLayout;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Layout component pattern — shared shell that wraps every category page.
 *    - Conditional rendering for the bgImage overlay.
 *    - Breadcrumb navigation using React Router <Link>.
 * 2. Dummy Data:
 *    - Products array passed from parent page via props.
 *    - Each parent page currently has hardcoded dummy products.
 * 3. Future API replacement:
 *    - Move data fetching to parent pages using useEffect + axios.
 *    - Category ID should be read from URL params or passed as prop.
 * 4. Design:
 *    - Matches the exact color theme: #8B1A1A primary, #F5F0EB secondary, Playfair + Lato fonts.
 */
