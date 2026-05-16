import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * DessertsPage
 * ============
 * Displays all Dessert products.
 *
 * Route: /menu/desserts
 */
function DessertsPage() {

    /*
     * DUMMY PRODUCT DATA — DESSERTS CATEGORY
     * ----------------------------------------
     * TODO (Future API): Replace with GET /api/products?category=<dessertsCategoryId>
     */
    const products = [
        {
            id: 1,
            name: 'Crème Brûlée',
            description: 'Velvety vanilla custard with a perfectly caramelized sugar crust on top.',
            price: 'Rs. 480',
            image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=contain&w=500&q=80',
            badge: 'CHEF SPECIAL',
        },
        {
            id: 2,
            name: 'Chocolate Mousse',
            description: 'Silky, airy dark chocolate mousse topped with shaved chocolate.',
            price: 'Rs. 420',
            image: 'https://images.unsplash.com/photo-1572383672419-ab35444a6934?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 3,
            name: 'Classic Tiramisu',
            description: 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.',
            price: 'Rs. 550',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 4,
            name: 'Cheesecake Jar',
            description: 'New York-style creamy cheesecake in a single-serve jar with berry coulis.',
            price: 'Rs. 380',
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 5,
            name: 'Strawberry Panna Cotta',
            description: 'Silky Italian milk pudding set with fresh strawberry jelly topping.',
            price: 'Rs. 440',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
        {
            id: 6,
            name: 'Brownie Sundae',
            description: 'Warm fudge brownie topped with vanilla ice cream and hot chocolate fudge.',
            price: 'Rs. 500',
            image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
    ];

    return (
        <CategoryPageLayout
            categoryName="Desserts"
            description="Indulgent, delicate desserts crafted for those who appreciate the finer sweet things in life."
            products={products}
            bgImage="https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default DessertsPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Route: /menu/desserts
 * 2. Dummy Data: 6 premium dessert products.
 * 3. Future: Load via GET /api/products?category=desserts
 */
