import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * IceCreamPage
 * ============
 * Displays all Ice Cream products.
 *
 * Route: /menu/ice-cream
 */
function IceCreamPage() {

    /*
     * DUMMY PRODUCT DATA — ICE CREAM CATEGORY
     * -----------------------------------------
     * TODO (Future API): Replace with GET /api/products?category=<iceCreamCategoryId>
     */
    const products = [
        {
            id: 1,
            name: 'Mango Kulfi',
            description: 'Traditional Pakistani frozen kulfi made with real Chaunsa mangoes.',
            price: 'Rs. 150',
            image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=contain&w=500&q=80',
            badge: 'SEASONAL',
        },
        {
            id: 2,
            name: 'Strawberry Sundae',
            description: 'Creamy vanilla ice cream topped with fresh strawberry sauce and nuts.',
            price: 'Rs. 280',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 3,
            name: 'Thick Chocolate Shake',
            description: 'Extra thick blended shake made with premium dark chocolate ice cream.',
            price: 'Rs. 380',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 4,
            name: 'Pistachio Scoop',
            description: 'Rich, nutty pistachio ice cream scoops with a toasted pistachio garnish.',
            price: 'Rs. 220',
            image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
        {
            id: 5,
            name: 'Vanilla Bean Cone',
            description: 'Classic vanilla bean ice cream in a crispy waffle cone. Pure and simple.',
            price: 'Rs. 180',
            image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 6,
            name: 'Mixed Berry Sorbet',
            description: 'Refreshing dairy-free sorbet bursting with mixed berry flavor. Vegan-friendly.',
            price: 'Rs. 250',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
    ];

    return (
        <CategoryPageLayout
            categoryName="Ice Cream"
            description="Cool down with our creamy scoops, kulfis, sundaes, and refreshing frozen treats."
            products={products}
            bgImage="https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default IceCreamPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Route: /menu/ice-cream
 * 2. Dummy Data: 6 ice cream products including kulfi and sorbet.
 * 3. Future: Load via GET /api/products?category=ice-cream
 */
