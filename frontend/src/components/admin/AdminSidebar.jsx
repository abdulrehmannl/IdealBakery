import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Grid, ShoppingBag, Users,
    Calendar, DollarSign, Archive, Settings, Monitor,
    BarChart2, Clock, Receipt, Tag, MapPin, ChevronRight
} from 'lucide-react';

/**
 * AdminSidebar Component
 * =======================
 * The persistent left-side navigation for ALL admin pages.
 * Highlights the active route using useLocation().
 *
 * Background: #1A1A1A (dark)
 * Active link: #8B1A1A (maroon)
 * Text: white
 */

// Navigation menu items — each maps to an admin page route
// To add a new page: just push a new object into this array
const NAV_ITEMS = [
    { label: 'Dashboard',     path: '/admin',            Icon: LayoutDashboard },
    { label: 'Products',      path: '/admin/products',   Icon: Package         },
    { label: 'Categories',    path: '/admin/categories', Icon: Grid            },
    { label: 'Orders',        path: '/admin/orders',     Icon: ShoppingBag     },
    { label: 'Staff',         path: '/admin/staff',      Icon: Users           },
    { label: 'Attendance',    path: '/admin/attendance', Icon: Calendar        },
    { label: 'Salaries',      path: '/admin/salaries',   Icon: DollarSign      },
    { label: 'Inventory',     path: '/admin/inventory',  Icon: Archive         },
    { label: 'Machinery',     path: '/admin/machinery',  Icon: Settings        },
    { label: 'Counter Sales', path: '/admin/counter',    Icon: Monitor         },
    { label: 'Reports',       path: '/admin/reports',    Icon: BarChart2       },
    { label: 'Staff Leave',   path: '/admin/leaves',     Icon: Clock           },
    { label: 'Expenses',      path: '/admin/expenses',   Icon: Receipt         },
    { label: 'Discounts',     path: '/admin/discounts',  Icon: Tag             },
    { label: 'Branches',      path: '/admin/branches',   Icon: MapPin          },
];

function AdminSidebar() {
    // useLocation gives us the current URL so we can highlight the active link
    const location = useLocation();

    /**
     * Checks if the given path is the currently active route.
     * Special case: /admin exactly matches only Dashboard (not /admin/products etc.)
     */
    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        /* Fixed full-height sidebar pinned to the left edge */
        <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col z-40 select-none"
            style={{ backgroundColor: '#1A1A1A' }}>

            {/* ── Logo / Bakery Name ── */}
            <div className="px-5 py-5 border-b border-white/10">
                <Link to="/" className="block">
                    <p className="font-logo text-white font-bold text-base leading-tight">
                        Ideal Sweets
                    </p>
                    <p className="font-logo text-white/60 text-xs">& Bakers</p>
                </Link>
                <span className="inline-block mt-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                    ADMIN
                </span>
            </div>

            {/* ── Navigation Links ── (scrollable if many items) */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {NAV_ITEMS.map(({ label, path, Icon }) => {
                    const active = isActive(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                                transition-all duration-150 group
                                ${active
                                    ? 'text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }
                            `}
                            style={active ? { backgroundColor: '#8B1A1A' } : {}}
                        >
                            {/* Icon */}
                            <Icon size={16} className={active ? 'text-white' : 'text-white/50 group-hover:text-white'} />
                            {/* Label */}
                            <span className="font-body">{label}</span>
                            {/* Active arrow indicator */}
                            {active && <ChevronRight size={14} className="ml-auto text-white/70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom: Back to Website link ── */}
            <div className="px-3 py-4 border-t border-white/10">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                    <ChevronRight size={14} className="rotate-180" />
                    Back to Website
                </Link>
            </div>

        </aside>
    );
}

export default AdminSidebar;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - useLocation() reads the current URL so we can highlight the active nav item.
 *    - isActive() is a helper function that checks if a nav item matches current path.
 *    - Fixed sidebar (position: fixed) stays visible while the right content scrolls.
 *    - NAV_ITEMS array — easy to add/remove pages by editing this one array.
 * 2. Design:
 *    - Background: #1A1A1A (near-black)
 *    - Active item: #8B1A1A (maroon — matches primary brand color)
 *    - Text: white / white/60 for inactive items
 * 3. Used in: AdminLayout.jsx
 */
