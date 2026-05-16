import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * BeveragesPage
 * =============
 * Displays all Beverage products.
 *
 * Route: /menu/beverages
 */
function BeveragesPage() {

    /*
     * DUMMY PRODUCT DATA — BEVERAGES CATEGORY
     * -----------------------------------------
     * TODO (Future API): Replace with GET /api/products?category=<beveragesCategoryId>
     */
    const products = [
        {
            id: 1,
            name: 'Café Latte',
            description: 'Smooth Italian espresso with steamed milk and a velvety foam layer.',
            price: 'Rs. 350',
            image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 2,
            name: 'Fresh Lemonade',
            description: 'Hand-squeezed lemon juice with sugar syrup, mint, and sparkling water.',
            price: 'Rs. 220',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 3,
            name: 'Mango Smoothie',
            description: 'Thick blended mango smoothie made with fresh Anwar Ratol mangoes.',
            price: 'Rs. 280',
            image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=contain&w=500&q=80',
            badge: 'SEASONAL',
        },
        {
            id: 4,
            name: 'Cold Brew Coffee',
            description: '12-hour steeped cold brew — smooth, bold, and low in acidity.',
            price: 'Rs. 380',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 5,
            name: 'Fresh Lime Soda',
            description: 'Chilled carbonated soda with fresh lime squeeze and a pinch of salt.',
            price: 'Rs. 180',
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
        {
            id: 6,
            name: 'Kashmiri Pink Tea',
            description: 'Traditional Kashmiri chai with almonds, cardamom, and a pink color.',
            price: 'Rs. 250',
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
    ];

    return (
        <CategoryPageLayout
            categoryName="Beverages"
            description="Hot teas, artisan coffees, freshly squeezed juices, and chilled refreshments for every mood."
            products={products}
            bgImage="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default BeveragesPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Route: /menu/beverages
 * 2. Dummy Data: 6 beverage products including hot and cold drinks.
 * 3. Future: Load via GET /api/products?category=beverages
 */
