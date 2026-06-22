import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Package, Grid, ShoppingBag, Users,
    Calendar, DollarSign, Archive, Settings, Monitor,
    BarChart2, Clock, Receipt, Tag, MapPin, ChevronRight, X, Briefcase
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard',     path: '/admin',            Icon: LayoutDashboard, allowedRoles: ['admin', 'manager'] },
    { label: 'Products',      path: '/admin/products',   Icon: Package,         allowedRoles: ['admin', 'manager'] },
    { label: 'Categories',    path: '/admin/categories', Icon: Grid,            allowedRoles: ['admin'] },
    { label: 'Orders',        path: '/admin/orders',     Icon: ShoppingBag,     allowedRoles: ['admin', 'manager', 'staff', 'delivery'] },
    { label: 'Staff',         path: '/admin/staff',      Icon: Users,           allowedRoles: ['admin', 'manager'] },
    { label: 'Attendance',    path: '/admin/attendance', Icon: Calendar,        allowedRoles: ['admin', 'manager', 'staff'] },
    { label: 'Salaries',      path: '/admin/salaries',   Icon: DollarSign,      allowedRoles: ['admin', 'manager'] },
    { label: 'Inventory',     path: '/admin/inventory',  Icon: Archive,         allowedRoles: ['admin', 'manager'] },
    { label: 'Machinery',     path: '/admin/machinery',  Icon: Settings,        allowedRoles: ['admin', 'manager'] },
    { label: 'Counter Sales', path: '/admin/counter',    Icon: Monitor,         allowedRoles: ['admin', 'manager', 'staff'] },
    { label: 'Reports',       path: '/admin/reports',    Icon: BarChart2,       allowedRoles: ['admin', 'manager'] },
    { label: 'Staff Leave',   path: '/admin/leaves',     Icon: Clock,           allowedRoles: ['admin', 'manager', 'staff', 'delivery'] },
    { label: 'Expenses',      path: '/admin/expenses',   Icon: Receipt,         allowedRoles: ['admin'] },
    { label: 'Branches',      path: '/admin/branches',   Icon: MapPin,          allowedRoles: ['admin'] },
    { label: 'Job Apps',      path: '/admin/jobs',       Icon: Briefcase,       allowedRoles: ['admin', 'manager'] },
];

function AdminSidebar({ mobileOpen, setMobileOpen }) {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`fixed top-0 left-0 h-screen w-64 md:w-56 flex flex-col z-50 select-none transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                style={{ backgroundColor: '#1A1A1A' }}>

                <div className="px-5 py-5 border-b border-white/10 flex justify-between items-center">
                    <div>
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
                    {/* Mobile Close Button */}
                    <button 
                        className="md:hidden text-white/60 hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    {NAV_ITEMS.filter(item => item.allowedRoles.includes(user?.role || 'admin')).map(({ label, path, Icon }) => {
                        const active = isActive(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileOpen(false)}
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
                                <Icon size={16} className={active ? 'text-white' : 'text-white/50 group-hover:text-white'} />
                                <span className="font-body">{label}</span>
                                {active && <ChevronRight size={14} className="ml-auto text-white/70" />}
                            </Link>
                        );
                    })}
                </nav>

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
        </>
    );
}

export default AdminSidebar;
