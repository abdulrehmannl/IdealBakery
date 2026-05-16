import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=2000&auto=format&fit=crop',
            title: 'Custom Cakes for Every Occasion',
            subtitle: 'Fully custom-designed cakes for birthdays, weddings, and special events — crafted fresh by hand, just for you!',
            buttonText: 'CUSTOM CAKES',
            // Clicking the button in this slide takes user to the Birthday Cakes special page
            buttonLink: '/special/birthday-cakes',
            clipPath: 'polygon(0 0, 92% 0, 100% 8%, 98% 92%, 100% 100%, 0 100%)',
            bgColor: 'bg-[#FAF7F2]/85' // Softer, less bright cream
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?q=80&w=2000&auto=format&fit=crop',
            title: 'Discover The Magic',
            subtitle: 'Rich, gooey, and absolutely perfect. Our signature cakes are here to make your day special.',
            buttonText: 'VIEW CAKES',
            // Clicking takes user to the Bakery Items category page
            buttonLink: '/menu/bakery',
            clipPath: 'polygon(0% 0%, 10% 3%, 20% 0%, 30% 3%, 40% 0%, 50% 3%, 60% 0%, 70% 3%, 80% 0%, 90% 3%, 100% 0%, 100% 100%, 0% 100%)',
            bgColor: 'bg-[#DFCCB2]/95' // Richer, deeper tinted beige for stronger color presence
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=2000&auto=format&fit=crop',
            title: 'A Treat Awaits',
            subtitle: 'Savor our freshly baked cookies, pastries, and savory delights all baked fresh throughout the day.',
            buttonText: 'BROWSE MENU',
            // Clicking takes user to the full menu page
            buttonLink: '/menu',
            clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)',
            bgColor: 'bg-white/85' // Light white frosted color
        }
    ];

    // Clone the first slide and add it to the end for seamless infinite loop
    const displayedSlides = [...slides, { ...slides[0], id: 'clone' }];

    const nextSlide = () => {
        if (currentSlide >= slides.length) return; // prevent spamming while snapping back
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 8000); 
        return () => clearInterval(timer);
    }, [currentSlide]); // restart timer on manual click to prevent double skipping

    // Handle seamless snapping when completing the transition to the cloned slide
    useEffect(() => {
        if (currentSlide === slides.length) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false); // disable animation temporarily
                setCurrentSlide(0); // snap back to real first slide seamlessly
            }, 1000); // 1000ms duration matching CSS 'duration-1000'
            return () => clearTimeout(timeout);
        }
    }, [currentSlide, slides.length]);

    return (
        <div className="relative w-full h-[600px] overflow-hidden group bg-gray-100">
            
            <div 
                className={`absolute inset-0 flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                style={{ width: `${displayedSlides.length * 100}%`, transform: `translateX(-${(currentSlide * 100) / displayedSlides.length}%)` }}
            >
                {displayedSlides.map((slide, index) => (
                    <div key={`${slide.id}-${index}`} className="w-full h-full relative" style={{ width: `${100 / displayedSlides.length}%` }}>
                        
                        <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Individual Text Box for each slide */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 z-20 w-full max-w-[28rem] pointer-events-none">
                            <div 
                                className="pointer-events-auto"
                                style={{
                                    filter: 'drop-shadow(0px 0px 2px #8B1A1A) drop-shadow(0px 4px 10px rgba(0,0,0,0.3))'
                                }}
                            >
                                <div 
                                    className={`${slide.bgColor} backdrop-blur-[6px] flex flex-col items-center text-center relative overflow-hidden`} 
                                    style={{ 
                                        clipPath: slide.clipPath, 
                                        padding: '2rem 3rem' 
                                    }}
                                >
                                    <h2 className="font-heading text-3xl md:text-4xl text-[#3E2723] mb-4 leading-tight tracking-tight font-bold">
                                        {slide.title}
                                    </h2>
                                    <p className="font-body text-[#3E2723]/90 mb-6 text-sm md:text-[15px] font-semibold leading-relaxed px-2">
                                        {slide.subtitle}
                                    </p>
                                    
                                    {/*
                                     * Carousel Main Button
                                     * If the slide has a `buttonLink`, clicking it navigates
                                     * to that route using a React Router <Link> component.
                                     * This makes the button a proper SPA navigation (no page reload).
                                     */}
                                    {slide.buttonLink ? (
                                        <Link
                                            to={slide.buttonLink}
                                            className="bg-[#1A2622] text-white px-8 py-3 rounded-full font-bold tracking-widest text-xs hover:bg-[#8B1A1A] transition-colors shadow-sm"
                                        >
                                            {slide.buttonText}
                                        </Link>
                                    ) : (
                                        <button className="bg-[#1A2622] text-white px-8 py-3 rounded-full font-bold tracking-widest text-xs hover:bg-[#8B1A1A] transition-colors shadow-sm">
                                            {slide.buttonText}
                                        </button>
                                    )}

                                    {/* Small Controls restored directly inside the card */}
                                    <div className="flex items-center gap-3 mt-6">
                                        <button onClick={prevSlide} className="bg-[#1A2622] text-white p-1 rounded-full shadow hover:bg-[#8B1A1A] transition-all">
                                            <ChevronLeft size={16} />
                                        </button>

                                        <div className="flex gap-1.5 px-2">
                                            {slides.map((_, dotIndex) => {
                                                const isActive = dotIndex === currentSlide || (currentSlide === slides.length && dotIndex === 0);
                                                return (
                                                    <button
                                                        key={dotIndex}
                                                        onClick={() => {
                                                            setIsTransitioning(true);
                                                            setCurrentSlide(dotIndex);
                                                        }}
                                                        className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#1A2622] w-3' : 'bg-[#1A2622]/30 w-2 hover:bg-[#1A2622]/60'}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        
                                        <button onClick={nextSlide} className="bg-[#1A2622] text-white p-1 rounded-full shadow hover:bg-[#8B1A1A] transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;
