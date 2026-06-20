import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryPageLayout from '../components/shared/CategoryPageLayout';
import api from '../utils/api';

/**
 * CategoryPage
 * ============
 * Dynamic page that fetches and displays products for a specific category.
 *
 * Route: /menu/:id
 */
function CategoryPage() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all categories and find the one that matches the id/slug
                const catRes = await api.get('/api/categories');
                if (catRes.data.success) {
                    const allCategories = catRes.data.data || [];
                    const foundCat = allCategories.find(c => 
                        c._id === id || c.name.toLowerCase() === id.toLowerCase()
                    );
                    setCategory(foundCat || null);
                }

                // Fetch products for this category
                const prodRes = await api.get(`/api/products?category=${id}&isAvailable=true`);
                if (prodRes.data.success) {
                    setProducts(prodRes.data.data);
                }
            } catch (err) {
                console.error("Failed to load category data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
                <p className="text-text-light font-bold text-lg">Loading Menu...</p>
            </div>
        );
    }

    if (!category && products.length === 0) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
                <p className="text-text-light font-bold text-lg">Category not found.</p>
            </div>
        )
    }

    return (
        <CategoryPageLayout
            categoryName={category?.name || "Category"}
            description={category?.description || "Explore our delicious items"}
            products={products.map(p => ({
                id: p._id,
                name: p.name,
                description: p.description,
                price: `Rs. ${p.price}`,
                image: p.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
                badge: p.discount > 0 ? `${p.discount}% OFF` : (p.stock < 5 && p.stock > 0 ? 'LOW STOCK' : null),
            }))}
            bgImage={category?.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80"}
        />
    );
}

export default CategoryPage;
