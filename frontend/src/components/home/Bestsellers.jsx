import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';        
import api from '../../utils/api';
import ProductCard from '../shared/ProductCard';

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
                        <ProductCard 
                            key={product._id} 
                            product={{
                                id: product._id,
                                name: product.name,
                                description: product.description,
                                price: product.price,
                                image: product.image,
                                badge: product.discount > 0 ? `${product.discount}% OFF` : null
                            }} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Bestsellers;
