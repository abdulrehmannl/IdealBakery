import React from 'react';
import { Link } from 'react-router-dom';

function Categories() {
    const categories = [
        { 
            id: 1, 
            name: 'Fast Food', 
            subcategories: ['Burgers', 'Rolls', 'Shawarma', 'Fries'],
            // Link goes directly to the Fast Food category page
            link: '/menu/fast-food',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
            id: 2, 
            name: 'Bakery Items', 
            subcategories: ['Cakes', 'Pastries', 'Breads', 'Cookies'],
            link: '/menu/bakery',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' 
        },
        { 
            id: 3, 
            name: 'Desi Items', 
            subcategories: ['Mithai', 'Barfi', 'Halwa'],
            link: '/menu/desi',
            image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=400&q=80' 
        },
        { 
            id: 4, 
            name: 'Desserts', 
            subcategories: ['Puddings', 'Mousses', 'Trifles'],
            link: '/menu/desserts',
            image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=400&q=80' 
        },
        { 
            id: 5, 
            name: 'Ice Cream', 
            subcategories: ['Scoops', 'Sundaes', 'Shakes'],
            link: '/menu/ice-cream',
            image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&w=400&q=80' 
        },
        { 
            id: 6, 
            name: 'Beverages', 
            subcategories: ['Hot Drinks', 'Cold Drinks'],
            link: '/menu/beverages',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80' 
        }
    ];

    return (
        <section className="bg-[#EBE2D5] py-20 px-8 select-none border-t border-border/50">
            <div className="max-w-[90rem] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-heading tracking-wider text-3xl md:text-4xl font-bold text-text-dark mb-4">
                        Explore Our Menu
                    </h2>
                    <p className="font-body text-text-light max-w-xl mx-auto text-m md:text-lg">
                        Discover our wide variety of freshly baked goods, savory delights, and traditional sweets crafted with passion.
                    </p>
                    <div className="w-16 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
                </div>
                
                <div className="flex overflow-x-auto pb-6 md:pb-0 justify-start lg:justify-between gap-6 lg:gap-0 snap-x snap-mandatory hide-scrollbar w-full">
                    {categories.map((category) => (
                        <Link 
                            to={category.link}
                            key={category.id} 
                            className="flex flex-col items-center gap-4 cursor-pointer group snap-center shrink-0 w-36 md:w-44 text-center hover:-translate-y-1 transition-transform"
                        >
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-4 border-transparent group-hover:border-primary/20">
                                <img 
                                    src={category.image} 
                                    alt={`${category.name} category`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-[#EBE2D5]"
                                />
                            </div>
                            <div className="flex flex-col items-center px-1 min-h-[3rem] relative overflow-hidden">
                                <span className="font-heading font-bold uppercase text-text-dark text-xs md:text-sm tracking-widest group-hover:-translate-y-8 transition-transform duration-300">
                                    {category.name}
                                </span>
                                <span className="absolute bottom-0 translate-y-8 font-body text-[10px] md:text-xs text-text-dark/80 font-bold tracking-wide group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    {category.subcategories.join(' • ')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link to="/menu" className="bg-[#602720] text-white px-8 py-3 rounded text-sm font-bold tracking-widest hover:bg-[#8B1A1A] transition-colors shadow-lg">
                        VIEW FULL MENU
                    </Link>
                </div>
            </div>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}

export default Categories;
