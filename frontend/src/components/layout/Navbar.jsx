import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuth();

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
                <Link to="/menu" className={navLinkClass('/menu')}>MENU</Link>
                <Link to="/about" className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors">ABOUT</Link>
                <a href="/#branches" className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors">
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
                <Link to="/order-tracking" className={navLinkClass('/order-tracking')}>TRACK ORDER</Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="font-nav text-sm font-bold text-text-dark">Hi, {user.name}</span>
                        {(user.role === 'admin' || user.role === 'manager') && (
                            <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>DASHBOARD</Link>
                        )}
                        {(user.role === 'staff' || user.role === 'delivery') && (
                            <Link to="/admin/orders" className={navLinkClass('/admin/orders')}>ORDERS</Link>
                        )}
                        <button 
                            onClick={logout} 
                            className="font-nav text-sm font-semibold tracking-wide text-red-600 hover:text-red-800 transition-colors">
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className={navLinkClass('/login')}>LOGIN</Link>
                )}

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