import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

function Bestsellers() {
    const [bestsellers, setBestsellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch first 4 products for now. If there's a specific route for bestsellers, we could use that.
                const res = await api.get('/api/products?isAvailable=true');
                if (res.data.success) {
                    // Just take the first 4 for the bestsellers showcase
                    setBestsellers(res.data.data.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to fetch bestsellers:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);


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
                            key={product._id} 
                            className="group flex flex-col h-full bg-secondary rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative"
                        >
                            {/* Product Badge */}
                            {(product.discount > 0) && (
                                <div className="absolute top-3 left-3 bg-text-dark text-white px-3 py-1 font-bold text-xs rounded-full z-10 shadow-sm">
                                    {product.discount}% OFF
                                </div>
                            )}

                            {/* Product Image Area with reduced height */}
                            <div className="h-40 md:h-48 bg-secondary p-4 flex items-center justify-center overflow-hidden relative border-b border-border">
                                <img 
                                    src={product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=contain&w=500&q=80&bg=F5F0EB'} 
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                                />
                            </div>

                            {/* Product Info below image */}
                            <div className="p-6 flex flex-col flex-1 text-center bg-white">
                                {/* Product name — click to go to product detail page */}
                                <Link
                                    to={`/product/${product._id}`}
                                    className="font-heading font-bold text-xl text-text-dark mb-2 hover:text-primary transition-colors block"
                                >
                                    {product.name}
                                </Link>
                                <p className="font-body text-text-light text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="mt-auto flex flex-col gap-3 items-center w-full">
                                    <span className="font-bold text-primary">Rs. {product.price}</span>
                                    {/* VIEW DETAILS → Product Detail Page */}
                                    <Link
                                        to={`/product/${product._id}`}
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
