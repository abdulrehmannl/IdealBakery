import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * DesiItemsPage
 * =============
 * Displays all Desi / Traditional Sweets products.
 *
 * Route: /menu/desi
 */
function DesiItemsPage() {

    /*
     * DUMMY PRODUCT DATA — DESI ITEMS CATEGORY
     * -----------------------------------------
     * TODO (Future API): Replace with GET /api/products?category=<desiCategoryId>
     * These are traditional Pakistani sweets (mithai) matched to the MongoDB Product schema.
     */
    const products = [
        {
            id: 1,
            name: 'Gulab Jamun',
            description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup.',
            price: 'Rs. 450 / kg',
            image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 2,
            name: 'Premium Barfi Box',
            description: 'Assorted milk barfi with pistachio, coconut, and kesar flavors.',
            price: 'Rs. 1200 / kg',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 3,
            name: 'Ras Malai',
            description: 'Paneer rounds in chilled saffron-flavored sweetened milk. Served cold.',
            price: 'Rs. 600 / kg',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
        {
            id: 4,
            name: 'Gajar Halwa',
            description: 'Slow-cooked carrot pudding with khoya, cardamom, and topped with almonds.',
            price: 'Rs. 500 / kg',
            image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 5,
            name: 'Crispy Jalebi',
            description: 'Fried spiral sweet soaked in light sugar syrup. Crispy & golden.',
            price: 'Rs. 380 / kg',
            image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 6,
            name: 'Kheer',
            description: 'Creamy rice pudding slow-cooked with milk, sugar, and cardamom.',
            price: 'Rs. 350',
            image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
    ];

    return (
        <CategoryPageLayout
            categoryName="Desi Items"
            description="Authentic Pakistani mithai and traditional sweets crafted with love and time-honored recipes."
            products={products}
            bgImage="https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default DesiItemsPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Route: /menu/desi
 * 2. Dummy Data: 6 traditional Pakistani sweets with kg pricing.
 * 3. Future: Load via GET /api/products?category=desi
 */
