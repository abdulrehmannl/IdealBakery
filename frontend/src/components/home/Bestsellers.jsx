import React from 'react';
import { Link } from 'react-router-dom';

function Bestsellers() {
    const bestsellers = [
        {
            id: 1,
            name: 'Classic Birthday Cake',
            description: 'Our signature vanilla cake layered with sprinkles and frosting.',
            price: 'Rs. 2500',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=contain&w=500&q=80&bg=F5F0EB',
            badge: 'BESTSELLER'
        },
        {
            id: 2,
            name: 'Chocolate Gooey Pie',
            description: 'Rich, dense chocolate filling inside a buttery graham cracker crust.',
            price: 'Rs. 1800',
            image: 'https://images.unsplash.com/photo-1572383672419-ab35444a6934?auto=format&fit=contain&w=500&q=80&bg=F5F0EB',
            badge: 'CUSTOMER FAVORITE'
        },
        {
            id: 3,
            name: 'Assorted Treat Box',
            description: 'A perfect sample mix of our cookies, truffles, and brownies.',
            price: 'Rs. 3200',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=contain&w=500&q=80&bg=F5F0EB',
            badge: 'NEW'
        },
        {
            id: 4,
            name: 'Red Velvet Craze',
            description: 'Moist red velvet cake with our signature cream cheese frosting.',
            price: 'Rs. 2200',
            image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=contain&w=500&q=80&bg=F5F0EB',
            badge: 'BESTSELLER'
        }
    ];

    return (
        <section className="bg-card-bg py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-heading text-4xl font-bold text-center text-text-dark">
                    Shop Our Bestsellers
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-4 mb-6"></div>
                <p className="font-body text-text-light text-center max-w-xl mx-auto mb-12">
                    Our most loved items — tried, tested, and impossible to resist.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                    {bestsellers.map((product) => (
                        <div 
                            key={product.id} 
                            className="group flex flex-col h-full bg-secondary rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative"
                        >
                            {/* Product Badge */}
                            {product.badge && (
                                <div className="absolute top-3 left-3 bg-text-dark text-white px-3 py-1 font-bold text-xs rounded-full z-10 shadow-sm">
                                    {product.badge}
                                </div>
                            )}

                            {/* Product Image Area with reduced height */}
                            <div className="h-40 md:h-48 bg-secondary p-4 flex items-center justify-center overflow-hidden relative border-b border-border">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                                />
                            </div>

                            {/* Product Info below image */}
                            <div className="p-6 flex flex-col flex-1 text-center bg-white">
                                {/* Product name — click to go to product detail page */}
                                <Link
                                    to={`/product/${product.id}`}
                                    className="font-heading font-bold text-xl text-text-dark mb-2 hover:text-primary transition-colors block"
                                >
                                    {product.name}
                                </Link>
                                <p className="font-body text-text-light text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="mt-auto flex flex-col gap-3 items-center w-full">
                                    <span className="font-bold text-primary">{product.price}</span>
                                    {/* VIEW DETAILS → Product Detail Page */}
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="w-full px-4 py-2.5 border-2 border-primary text-primary font-bold text-sm tracking-wide hover:bg-primary hover:text-white transition-colors rounded text-center"
                                    >
                                        VIEW DETAILS
                                    </Link>
                                    {/* ORDER NOW → Checkout Page */}
                                    <Link
                                        to="/checkout"
                                        className="w-full px-4 py-3 bg-primary text-white font-bold text-sm tracking-wide hover:bg-[#6A1414] transition-colors rounded text-center"
                                    >
                                        ORDER NOW
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Bestsellers;
