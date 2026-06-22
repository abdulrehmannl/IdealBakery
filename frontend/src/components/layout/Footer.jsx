import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

function Footer() {
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await api.get('/api/branches');
                if (res.data.success) {
                    setBranches(res.data.branches || res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to load branches:', err);
            }
        };
        fetchBranches();
    }, []);

    return (
        <>
            {/*
             * DECORATIVE DIVIDER
             * ===================
             * Replaces the old "Sign Up to get 10% Discount" promotional bar.
             * A clean branded separator with the bakery's signature mark.
             * This visually signals the transition from page content to the footer.
             */}
            <div className="w-full py-6 flex flex-col items-center gap-3" style={{ backgroundColor: '#F5F0EB' }}>
                {/* Horizontal rule with a centered diamond ornament */}
                <div className="flex items-center gap-4 w-full max-w-4xl px-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4C5B0]" />
                    {/* Diamond ornament made of two triangles using CSS borders */}
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rotate-45 rounded-sm" />
                        <span className="font-heading text-sm font-bold text-primary tracking-[0.3em] uppercase">
                            Ideal Sweets & Bakers
                        </span>
                        <div className="w-1.5 h-1.5 bg-primary rotate-45 rounded-sm" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4C5B0]" />
                </div>
                {/* Tagline below */}
                <p className="font-body text-xs text-text-light tracking-widest">
                    Baked Fresh. Served with Love. Since 1995.
                </p>
            </div>

            <footer className="bg-secondary text-[#3E2723] pt-12 pb-8 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start w-full border-b border-[#D4C5B0]/40 pb-12 relative z-10">

                {/* Column 1: 100% Quality Guaranteed Badge & Text */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left z-20">
                    <div className="flex items-center gap-5 text-left">
                        <div className="flex flex-col items-center text-center w-28 shrink-0">
                            <span className="font-body font-bold text-lg tracking-wide text-[#3E2723] mb-0.5">Certified</span>
                            <div className="w-24 h-24 border-4 border-[#3E2723] rounded-full flex flex-col items-center justify-center shrink-0">
                                <span className="font-heading text-4xl font-bold text-[#3E2723] tracking-tighter leading-none">100%</span>
                            </div>
                            <span className="font-body font-bold text-sm uppercase tracking-widest text-[#3E2723] mt-2 text-center leading-tight">Quality<br/>Guaranteed</span>
                        </div>
                        <p className="font-body text-sm font-semibold text-[#3E2723]/90 leading-relaxed max-w-[260px] pt-4">
                            As the first Certified B Corporation bakery in the Pacific Northwest, we are committed to balancing purpose and profit.
                        </p>
                    </div>
                </div>

                {/* Column 2: Large Center Logo (Absolute Centered over the gap) */}
                <div className="hidden lg:flex absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 justify-center z-10 pointer-events-none w-full max-w-[650px]">
                    <img
                        src="/logo.png"
                        alt="Ideal Sweets & Bakers Logo"
                        className="w-full max-w-[600px] h-auto object-contain object-center transform scale-[1.15] pointer-events-auto"
                        title="Place your actual logo.png file directly into frontend/public/logo.png"
                    />
                </div>
                {/* Mobile/Tablet Fallback Logo */}
                <div className="flex lg:hidden justify-center shrink-0 -my-4 z-10 relative">
                    <img
                        src="/logo.png"
                        alt="Ideal Sweets & Bakers Logo"
                        className="w-[400px] max-w-full h-auto object-contain"
                    />
                </div>

                {/* Column 3: Quick Links & Contact */}
                <div className="flex flex-col gap-3 z-20 text-center md:text-left pt-6">
                    <div className="grid grid-cols-2 gap-6 md:gap-10 text-sm font-bold uppercase tracking-wider text-[#3E2723]">
                        <div className="flex flex-col gap-2.5">
                            <a href="/contact" className="hover:text-primary transition-colors underline underline-offset-4 decoration-current hover:decoration-primary whitespace-nowrap">Contact Us & FAQs</a>
                            <a href="/jobs" className="hover:text-primary transition-colors underline underline-offset-4 decoration-current hover:decoration-primary whitespace-nowrap">Apply for a Job</a>
                            <a href="/wholesale" className="hover:text-primary transition-colors underline underline-offset-4 decoration-current hover:decoration-primary whitespace-nowrap">Wholesale</a>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <a href="/find-our-bread" className="hover:text-primary transition-colors underline underline-offset-4 decoration-current hover:decoration-primary whitespace-nowrap">Find our bread</a>
                            <a href="/privacy-policy" className="hover:text-primary transition-colors underline underline-offset-4 decoration-current hover:decoration-primary whitespace-nowrap">Privacy Policy</a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Neighborhood Cafes Section */}
            <div className="max-w-7xl mx-auto pt-10 text-center">
                <h4 className="font-heading font-bold uppercase tracking-widest text-[#3E2723] text-lg mb-6">Neighborhood Cafes</h4>
                <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-bold tracking-widest text-[#3E2723]">
                    {branches.length > 0 ? branches.map((b, idx) => (
                        <React.Fragment key={b._id}>
                            <a href="#branches" className="hover:text-primary uppercase">{b.name}</a>
                            {idx < branches.length - 1 && <span className="text-[#3E2723]/30">|</span>}
                        </React.Fragment>
                    )) : (
                        <>
                            <a href="#branch1" className="hover:text-primary">DAWOOD CHOWK</a>
                            <span className="text-[#3E2723]/30">|</span>
                            <a href="#branch2" className="hover:text-primary">ARRA TULLA ROAD</a>
                            <span className="text-[#3E2723]/30">|</span>
                            <a href="#branch3" className="hover:text-primary">MAIN CITY</a>
                            <span className="text-[#3E2723]/30">|</span>
                            <a href="#branch4" className="hover:text-primary">GULSHAN-E-IQBAL</a>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="max-w-7xl mx-auto mt-16 flex flex-col items-center">
                {/* Social media links simple icons */}
                <div className="flex justify-center gap-6 font-bold text-[#3E2723] text-lg">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="https://wa.me/923234404772" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                        </svg>
                    </a>
                </div>

                <div className="mt-10 mb-4 w-full text-center">
                    <p className="text-xs font-bold tracking-widest text-[#3E2723]/60 uppercase">
                        © 2026 Ideal Sweets & Bakers. <a href="/privacy-policy" className="hover:text-primary underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
            </footer>
        </>
    );
}

export default Footer;
