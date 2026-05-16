import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * BakeryItemsPage
 * ===============
 * Displays all Bakery Items products in a grid using the shared CategoryPageLayout.
 *
 * Route: /menu/bakery
 */
function BakeryItemsPage() {

    /*
     * DUMMY PRODUCT DATA — BAKERY ITEMS CATEGORY
     * -------------------------------------------
     * TODO (Future API): Replace this array with:
     *   GET /api/products?category=<bakeryItemsCategoryId>
     */
    const products = [
        {
            id: 1,
            name: 'Black Forest Cake',
            description: 'Layers of chocolate sponge, whipped cream, and dark cherries.',
            price: 'Rs. 2200',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 2,
            name: 'Butter Croissant',
            description: 'Flaky, golden croissants made with pure butter — baked every morning.',
            price: 'Rs. 180',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 3,
            name: 'Fruit Danish',
            description: 'Laminated pastry filled with vanilla cream and seasonal fruit toppings.',
            price: 'Rs. 220',
            image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 4,
            name: 'Marble Cake',
            description: 'Swirled vanilla and chocolate sponge with a dusting of powdered sugar.',
            price: 'Rs. 1400',
            image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 5,
            name: 'Assorted Cookies Box',
            description: 'A curated box of chocolate chip, oatmeal raisin, and shortbread cookies.',
            price: 'Rs. 950',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
        {
            id: 6,
            name: 'Sourdough Loaf',
            description: 'Naturally fermented artisan bread with a crispy crust and tangy crumb.',
            price: 'Rs. 580',
            image: 'https://images.unsplash.com/photo-1585478259715-1c195a3e7b8e?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 7,
            name: 'Cinnamon Roll',
            description: 'Soft, pillowy rolls swirled with cinnamon sugar and cream cheese glaze.',
            price: 'Rs. 280',
            image: 'https://images.unsplash.com/photo-1551879400-111a9087cd86?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
        {
            id: 8,
            name: 'Fudge Brownie',
            description: 'Dense, chocolatey fudge brownies with walnut chunks. Served warm.',
            price: 'Rs. 320',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
    ];

    return (
        <CategoryPageLayout
            categoryName="Bakery Items"
            description="Fresh-from-the-oven cakes, pastries, artisan breads, and sweet treats — baked daily."
            products={products}
            bgImage="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default BakeryItemsPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Route: /menu/bakery
 * 2. Dummy Data: 8 bakery products with Rs. pricing.
 * 3. Future: Load via GET /api/products?category=bakery
 */
