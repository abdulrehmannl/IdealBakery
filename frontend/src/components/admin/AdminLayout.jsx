import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

/**
 * AdminLayout Component
 * ======================
 * The shell layout that wraps ALL admin pages.
 * Structure:
 *   ┌─────────────┬──────────────────────────────────┐
 *   │             │  Top Bar (page title)             │
 *   │  Sidebar    ├──────────────────────────────────┤
 *   │  (fixed)    │  Page Content (scrollable)        │
 *   │             │                                   │
 *   └─────────────┴──────────────────────────────────┘
 *
 * Usage: Wrap any admin page with <AdminLayout>...</AdminLayout>
 * The sidebar is always shown; only the right-side content changes per page.
 */

/**
 * Maps URL paths to human-readable page titles shown in the top bar.
 * If a path isn't here, falls back to "Admin Panel".
 */
const PAGE_TITLES = {
    '/admin':             'Dashboard',
    '/admin/products':    'Manage Products',
    '/admin/categories':  'Manage Categories',
    '/admin/orders':      'Manage Orders',
    '/admin/staff':       'Manage Staff',
    '/admin/attendance':  'Attendance',
    '/admin/salaries':    'Salaries',
    '/admin/inventory':   'Inventory',
    '/admin/machinery':   'Machinery',
    '/admin/counter':     'Counter Sales (POS)',
    '/admin/reports':     'Reports',
    '/admin/leaves':      'Staff Leave',
    '/admin/expenses':    'Expenses',
    '/admin/discounts':   'Manage Discounts',
    '/admin/branches':    'Manage Branches',
};

function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Get the current path to look up the page title
    const location = useLocation();
    const pageTitle = PAGE_TITLES[location.pathname] || 'Admin Panel';

    const branchName = user?.role === 'admin' ? 'All Branches' : (user?.branch?.name || 'No Branch Assigned');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Current date string for display in the top bar
    const today = new Date().toLocaleDateString('en-PK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        /*
         * Root container: full viewport height, flex row layout
         * Left: AdminSidebar (fixed, 224px wide = w-56)
         * Right: main content area (takes remaining space, scrollable)
         */
        <div className="flex h-screen overflow-hidden font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ── Left: Sidebar (fixed, always visible on desktop, hidden on mobile) ── */}
            <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/*
             * ── Right: Main Content Area ──
             * md:ml-56 = left margin of 224px to avoid overlapping with the fixed sidebar on desktop
             * flex-1 = takes all remaining horizontal space
             * overflow-y-auto = allows the content to scroll vertically
             */}
            <div className="md:ml-56 flex-1 flex flex-col overflow-hidden w-full">

                {/* ── Top Bar ── */}
                {/*
                 * Shows the current page title (e.g., "Dashboard", "Manage Orders")
                 * and today's date on the right side.
                 * Background: white with a subtle bottom border.
                 */}
                <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10 w-full">
                    {/* Left: Mobile Menu Toggle + Current page title */}
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden text-text-dark hover:text-primary transition-colors"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-heading font-bold text-lg md:text-xl text-text-dark truncate max-w-[150px] sm:max-w-none">
                            {pageTitle}
                        </h1>
                    </div>
                    {/* Right: Today's date + branch badge + user info */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <span className="font-body text-sm text-text-light hidden lg:block">{today}</span>
                        
                        {/* ── Branch Badge ── */}
                        <div className="px-3 py-1 bg-[#F5F0EB] border border-[#8B1A1A]/20 text-[#8B1A1A] text-xs font-bold rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
                            {branchName} <span role="img" aria-label="store">🏪</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:gap-2">
                            <div className="flex items-center gap-2">
                                {/* Simple avatar circle with initial */}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: '#8B1A1A' }}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-sm font-semibold text-text-dark block">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                                    <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block leading-none mt-0.5">
                                        Role: {user?.role || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout} 
                            className="text-xs text-text-light hover:text-[#8B1A1A] font-bold transition-colors ml-2"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* ── Page Content ── */}
                {/*
                 * This is the scrollable area where each admin page renders its content.
                 * `children` = whatever is inside <AdminLayout>...</AdminLayout>
                 * overflow-y-auto = makes this area scroll, not the whole window
                 */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}

export default AdminLayout;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - `children` prop: anything wrapped inside <AdminLayout> gets rendered here.
 *    - useLocation() reads the current URL to display the correct page title.
 *    - ml-56 creates space for the fixed 224px (w-56) sidebar on the left.
 *    - overflow-hidden on the outer div + overflow-y-auto on main = only content scrolls.
 * 2. Used by: App.jsx wraps every /admin/* route with this component.
 * 3. Not used on: customer-facing pages (/, /menu, /login, etc.)
 */
