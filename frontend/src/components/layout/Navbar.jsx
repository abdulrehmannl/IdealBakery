import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 * Global navigation bar for the application.
 * Follows the specified layout:
 * - Left: Navigation links (Menu, About, Branches)
 * - Center: Logo (Super Ideal text)
 * - Right: Login link and Order Now button
 */
function Navbar() {
    // useLocation tells us which page we're currently on
    // We use this to highlight the active nav link
    const location = useLocation();

    /**
     * Helper function to build the CSS class for a nav link.
     * If the link's path matches the current page, it gets text-primary (maroon).
     * Otherwise it's text-text-dark (dark gray).
     *
     * @param {string} path - The route to compare, e.g. "/menu"
     * @returns {string} Tailwind class string
     */
    const navLinkClass = (path) =>
        `font-nav text-sm font-semibold tracking-wide transition-colors ${
            location.pathname === path || location.pathname.startsWith(path + '/')
                ? 'text-primary'
                : 'text-text-dark hover:text-primary'
        }`;

    return (
        <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50 px-8 py-4 flex items-center justify-between">

            {/* ── Left: Navigation Links ── */}
            <div className="flex-1 flex gap-6">
                {/* MENU → goes to /menu page */}
                <Link to="/menu" className={navLinkClass('/menu')}>MENU</Link>

                {/* ABOUT — placeholder route (page coming soon) */}
                <Link to="/about" className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors">ABOUT</Link>

                {/*
                 * BRANCHES — uses a plain <a> anchor tag (NOT React Router <Link>).
                 *
                 * Why? Because we want to navigate to the HOME PAGE and scroll to
                 * the section with id="branches" (the "Visit Us" section in Branches.jsx).
                 *
                 * React Router <Link to="/#branches"> doesn't trigger hash-scrolling
                 * between pages reliably. A plain <a href="/#branches"> works perfectly:
                 *   - If already on the homepage → browser scrolls to #branches
                 *   - If on another page → navigates to home then scrolls to #branches
                 */}
                <a
                    href="/#branches"
                    className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors"
                >
                    BRANCHES
                </a>
            </div>

            {/* ── Center: Logo ── */}
            <div className="flex-1 flex justify-center">
                <Link to="/">
                    <h1 className="font-logo text-3xl md:text-3xl font-bold text-primary tracking-tight">
                        Ideal Sweets and Bakers
                    </h1>
                </Link>
            </div>

            {/* ── Right: Actions ── */}
            <div className="flex-1 flex items-center justify-end gap-5">

                {/* ORDER TRACKING link */}
                <Link
                    to="/order-tracking"
                    className={navLinkClass('/order-tracking')}
                >
                    TRACK ORDER
                </Link>

                {/* LOGIN / PROFILE link */}
                <Link to="/login" className={navLinkClass('/login')}>LOGIN</Link>

                {/* ORDER NOW → goes to /menu page */}
                <Link
                    to="/menu"
                    className="bg-primary text-white px-6 py-2 rounded font-nav text-sm font-bold tracking-wide hover:bg-[#6A1414] transition-colors shadow shadow-primary/20"
                >
                    ORDER NOW
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - react-router-dom Link components to prevent page reloads
 *    - Flexbox distribution (flex-1) to center the logo perfectly regardless of side content widths.
 * 2. Dummy Data: 
 *    - Anchor links (#about, #branches) are placed as placeholders. 
 * 3. Known limitations:
 *    - Mobile responsiveness (hamburger menu) isn't fully implemented yet, relies on flex wrapping/scaling currently.
 * 4. Performance considerations:
 *    - Uses 'sticky' positioning to prevent recalculating layout shifts.
 */