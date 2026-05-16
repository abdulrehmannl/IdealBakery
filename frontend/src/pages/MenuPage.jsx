import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * MenuPage
 * ========
 * The main menu landing page. Shows all 6 categories as clickable cards.
 * When the user clicks "MENU" from the navbar (or anywhere on the site),
 * they land here and the page auto-scrolls to the categories section.
 *
 * Each category card links to its own dedicated category page.
 */
function MenuPage() {
    // useLocation lets us read the current URL (including hash like #categories)
    const location = useLocation();

    // Auto-scroll to the categories section when the page loads
    // This ensures the user immediately sees the categories when clicking "MENU"
    useEffect(() => {
        // Small delay to let the page render first, then scroll smoothly
        const timer = setTimeout(() => {
            const categoriesSection = document.getElementById('menu-categories');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        return () => clearTimeout(timer); // cleanup timer on unmount
    }, [location.pathname]); // re-run if the path changes

    /*
     * DUMMY DATA — CATEGORIES
     * -----------------------
     * TODO (Future API): Replace this array with data fetched from:
     *   GET /api/categories
     * Each category will have: name, description, image, _id, isActive
     * The `link` field maps to the React Router route for that category page.
     */
    const categories = [
        {
            id: 1,
            name: 'Fast Food',
            description: 'Burgers, rolls, shawarma, fries & more savory bites',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            link: '/menu/fast-food',
            itemCount: 8,
            badge: 'MOST POPULAR',
        },
        {
            id: 2,
            name: 'Bakery Items',
            description: 'Fresh cakes, pastries, breads & cookies baked daily',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
            link: '/menu/bakery',
            itemCount: 8,
            badge: null,
        },
        {
            id: 3,
            name: 'Desi Items',
            description: 'Authentic mithai, barfi, halwa & traditional sweets',
            image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=600&q=80',
            link: '/menu/desi',
            itemCount: 6,
            badge: null,
        },
        {
            id: 4,
            name: 'Desserts',
            description: 'Mousse, tiramisu, crème brûlée & indulgent treats',
            image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
            link: '/menu/desserts',
            itemCount: 6,
            badge: null,
        },
        {
            id: 5,
            name: 'Ice Cream',
            description: 'Kulfi, sundaes, scoops & refreshing frozen delights',
            image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&w=600&q=80',
            link: '/menu/ice-cream',
            itemCount: 6,
            badge: 'SEASONAL',
        },
        {
            id: 6,
            name: 'Beverages',
            description: 'Hot teas, lattes, fresh juices, smoothies & shakes',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
            link: '/menu/beverages',
            itemCount: 6,
            badge: null,
        },
    ];

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: HERO BANNER
                Small maroon hero at the top of the page
            ══════════════════════════════════════════ */}
            <div className="bg-primary text-white py-16 px-8 text-center">
                {/* Breadcrumb: Home → Menu */}
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-5 font-body">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="text-white/40">›</span>
                    <span className="text-white font-semibold">Menu</span>
                </div>

                {/* Main page title */}
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                    Our Full Menu
                </h1>

                {/* Decorative line */}
                <div className="w-16 h-1 bg-white/50 mx-auto mb-5 rounded-full" />

                {/* Subtitle */}
                <p className="font-body text-white/80 max-w-lg mx-auto text-lg">
                    Everything freshly made, every single day. Pick a category to explore.
                </p>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 2: CATEGORIES GRID
                6 big clickable category cards
                This section has id="menu-categories" so the
                useEffect above can scroll straight to it.
            ══════════════════════════════════════════ */}
            <section id="menu-categories" className="py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Section heading */}
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-text-dark">
                            Browse by Category
                        </h2>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
                    </div>

                    {/*
                        Category cards grid:
                        - 3 columns on large screens
                        - 2 columns on medium screens
                        - 1 column on mobile
                    */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            /*
                             * Each category card is a <Link> wrapping the entire card,
                             * so clicking anywhere on the card navigates to the category page.
                             */
                            <Link
                                key={category.id}
                                to={category.link}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-border"
                            >
                                {/* ── Badge (top-left, only if present) ── */}
                                {category.badge && (
                                    <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wider">
                                        {category.badge}
                                    </div>
                                )}

                                {/* ── Category Image ── */}
                                {/* Fixed height ensures all cards look uniform in the grid */}
                                <div className="h-52 overflow-hidden relative">
                                    <img
                                        src={category.image}
                                        alt={`${category.name} category`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Gradient overlay fades from transparent at top to dark at bottom */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                                </div>

                                {/* ── Category Info ── */}
                                <div className="p-6 flex flex-col flex-1 border-t border-border/50">
                                    {/* Category name */}
                                    <h3 className="font-heading text-2xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>

                                    {/* Short description */}
                                    <p className="font-body text-text-light text-sm mb-4 flex-1">
                                        {category.description}
                                    </p>

                                    {/* Footer row: item count + arrow */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                                        <span className="text-xs font-bold text-text-light tracking-widest uppercase">
                                            {category.itemCount} Items
                                        </span>
                                        {/* ArrowRight moves right on hover to show interactivity */}
                                        <ArrowRight
                                            size={20}
                                            className="text-primary group-hover:translate-x-1 transition-transform"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 3: SPECIAL ORDERS CTA
                Quick links to the 3 special order pages
            ══════════════════════════════════════════ */}
            <section className="bg-primary text-white py-14 px-8 text-center">
                <h2 className="font-heading text-3xl font-bold mb-4">
                    Need a Custom Order?
                </h2>
                <div className="w-12 h-1 bg-white/40 mx-auto mb-5 rounded-full" />
                <p className="font-body text-white/80 max-w-md mx-auto mb-10 text-lg">
                    We handle custom cakes, gift boxes, and bulk event orders.
                </p>
                {/* Three quick-link buttons for special order pages */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/special/birthday-cakes"
                        className="bg-white text-primary px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow"
                    >
                        🎂 BIRTHDAY CAKES
                    </Link>
                    <Link
                        to="/special/gift-boxes"
                        className="bg-white text-primary px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow"
                    >
                        🎁 GIFT BOXES
                    </Link>
                    <Link
                        to="/special/event-orders"
                        className="bg-white text-primary px-8 py-3 rounded font-bold text-sm tracking-widest hover:bg-secondary transition-colors shadow"
                    >
                        🎉 EVENT ORDERS
                    </Link>
                </div>
            </section>

        </div>
    );
}

export default MenuPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - useEffect + scrollIntoView to auto-scroll to categories when the page loads.
 *    - useLocation from react-router-dom to detect path changes.
 *    - <Link> wrapping entire cards makes the full card clickable without extra JS.
 *    - Gradient overlays (bg-gradient-to-t) to darken images for readability.
 * 2. Dummy Data:
 *    - `categories` array is hardcoded with dummy item counts and images.
 *    - TODO: Replace with API call to GET /api/categories
 * 3. Navigation:
 *    - Each category links to /menu/<slug> (e.g., /menu/fast-food).
 *    - Special order links go to /special/<slug>.
 * 4. Performance:
 *    - Images are loaded from Unsplash CDN.
 *    - Consider adding loading="lazy" to <img> tags when the list grows.
 */
