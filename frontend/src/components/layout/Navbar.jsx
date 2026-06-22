import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';

function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClass = (path) =>
        `font-nav text-sm font-semibold tracking-wide transition-colors ${
            location.pathname === path || location.pathname.startsWith(path + '/')
                ? 'text-primary'
                : 'text-text-dark hover:text-primary'
        }`;

    return (
        <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between">

            {/* ── Mobile Hamburger Button ── */}
            <div className="md:hidden flex-1 flex items-center">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-text-dark hover:text-primary transition-colors">
                    <Menu size={28} />
                </button>
            </div>

            {/* ── Left: Navigation Links (Desktop) ── */}
            <div className="hidden md:flex flex-1 gap-6">
                <Link to="/menu" className={navLinkClass('/menu')}>MENU</Link>
                <Link to="/about" className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors">ABOUT</Link>
                <a href="/#branches" className="font-nav text-sm font-semibold tracking-wide text-text-dark hover:text-primary transition-colors">
                    BRANCHES
                </a>
            </div>

            {/* ── Center: Logo ── */}
            <div className="flex-1 flex justify-center">
                <Link to="/">
                    <h1 className="font-logo text-2xl md:text-3xl font-bold text-primary tracking-tight text-center">
                        Ideal Sweets<span className="hidden sm:inline"> and Bakers</span>
                    </h1>
                </Link>
            </div>

            {/* ── Right: Actions ── */}
            <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
                <Link to="/order-tracking" className={`hidden md:block ${navLinkClass('/order-tracking')}`}>TRACK ORDER</Link>

                {user ? (
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/profile" className="font-nav text-sm font-bold text-text-dark hover:text-primary transition-colors">
                            Hi, {user.name?.split(' ')[0]}
                        </Link>
                        {(user.role === 'admin' || user.role === 'manager') && (
                            <Link to="/admin" className={navLinkClass('/admin')}>DASHBOARD</Link>
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
                    <Link to="/login" className={`hidden md:block ${navLinkClass('/login')}`}>LOGIN</Link>
                )}

                <Link
                    to="/checkout"
                    className="relative text-text-dark hover:text-primary transition-colors flex items-center"
                >
                    <ShoppingCart size={24} />
                    {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {getCartCount()}
                        </span>
                    )}
                </Link>

                <Link
                    to="/menu"
                    className="hidden md:block bg-primary text-white px-6 py-2 rounded font-nav text-sm font-bold tracking-wide hover:bg-[#6A1414] transition-colors shadow shadow-primary/20"
                >
                    ORDER NOW
                </Link>
            </div>

            {/* ── Mobile Slide-out Menu ── */}
            <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div 
                    className={`fixed inset-y-0 left-0 w-[280px] bg-[#F5F0EB] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-border/50">
                        <h2 className="font-logo text-2xl font-bold text-primary">IdealBakery</h2>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-light hover:text-text-dark transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 p-6 gap-6 overflow-y-auto">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">HOME</Link>
                        <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-primary">FULL MENU</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">ABOUT US</Link>
                        <a href="/#branches" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">OUR BRANCHES</a>
                        <Link to="/order-tracking" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">TRACK ORDER</Link>
                        
                        <div className="w-12 h-1 bg-border/50 rounded-full my-2"></div>

                        {user ? (
                            <>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">MY PROFILE</Link>
                                {(user.role === 'admin' || user.role === 'manager') && (
                                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">ADMIN DASHBOARD</Link>
                                )}
                                {(user.role === 'staff' || user.role === 'delivery') && (
                                    <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">MANAGE ORDERS</Link>
                                )}
                                <button 
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                                    className="font-nav text-lg font-bold text-red-600 text-left">
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">LOGIN</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="font-nav text-lg font-bold text-text-dark">CREATE ACCOUNT</Link>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-border/50">
                        <Link
                            to="/menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center bg-primary text-white px-6 py-3 rounded font-nav text-sm font-bold tracking-widest hover:bg-[#6A1414] transition-colors"
                        >
                            START ORDER
                        </Link>
                    </div>
                </div>
            </div>

        </nav>
    );
}

export default Navbar;