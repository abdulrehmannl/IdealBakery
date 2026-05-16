import React from 'react';
import CategoryPageLayout from '../../components/shared/CategoryPageLayout';

/**
 * FastFoodPage
 * ============
 * Displays all Fast Food products in a grid using the shared CategoryPageLayout.
 *
 * Route: /menu/fast-food
 * Navigated from: MenuPage category card + Navbar MENU → Menu page → Fast Food card
 */
function FastFoodPage() {

    /*
     * DUMMY PRODUCT DATA — FAST FOOD CATEGORY
     * ----------------------------------------
     * TODO (Future API): Replace this array with data fetched from:
     *   GET /api/products?category=<fastFoodCategoryId>
     * Use axios inside a useEffect() and useState() like:
     *
     *   const [products, setProducts] = useState([]);
     *   useEffect(() => {
     *     axios.get('/api/products?category=fastfood')
     *       .then(res => setProducts(res.data))
     *       .catch(err => console.error(err));
     *   }, []);
     *
     * The shape of each product object should match the MongoDB Product schema:
     * { name, description, price, discount, weight, stock, tags, isAvailable, isSugarFree, image, category, branch }
     */
    const products = [
        {
            id: 1,
            name: 'Zinger Burger',
            description: 'Crispy spiced chicken fillet, lettuce, and mayo in a toasted bun.',
            price: 'Rs. 450',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=contain&w=500&q=80',
            badge: 'BESTSELLER',
        },
        {
            id: 2,
            name: 'BBQ Beef Burger',
            description: 'Juicy beef patty with smoky BBQ sauce, cheese, and caramelized onions.',
            price: 'Rs. 550',
            image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 3,
            name: 'Chicken Roll',
            description: 'Tender grilled chicken strips wrapped in a flaky paratha with raita.',
            price: 'Rs. 280',
            image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 4,
            name: 'Beef Shawarma',
            description: 'Slow-roasted beef in lavash bread with garlic sauce and pickles.',
            price: 'Rs. 320',
            image: 'https://images.unsplash.com/photo-1561651188-d207bbec4ec3?auto=format&fit=contain&w=500&q=80',
            badge: 'CUSTOMER FAV',
        },
        {
            id: 5,
            name: 'Loaded Fries',
            description: 'Crispy golden fries topped with cheese sauce, jalapeños, and sour cream.',
            price: 'Rs. 350',
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 6,
            name: 'Club Sandwich',
            description: 'Triple-decker with chicken, egg, lettuce, tomato, and creamy mayo.',
            price: 'Rs. 480',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
        {
            id: 7,
            name: 'Chicken Nuggets',
            description: '8-piece golden crispy nuggets served with honey mustard dipping sauce.',
            price: 'Rs. 380',
            image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=contain&w=500&q=80',
            badge: 'NEW',
        },
        {
            id: 8,
            name: 'Spicy Wings',
            description: 'Buffalo-style spicy chicken wings glazed in our signature hot sauce.',
            price: 'Rs. 420',
            image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=contain&w=500&q=80',
            badge: null,
        },
    ];

    return (
        /*
         * CategoryPageLayout handles:
         *  - The maroon hero banner with breadcrumb + title
         *  - The responsive product grid
         *  - The "Back to Full Menu" link at the bottom
         */
        <CategoryPageLayout
            categoryName="Fast Food"
            description="Fresh burgers, crispy rolls, shawarma, and savory bites — made to order."
            products={products}
            bgImage="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80"
        />
    );
}

export default FastFoodPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Thin "page" component — all display logic lives in CategoryPageLayout.
 *    - This page only owns its own data (products array).
 * 2. Dummy Data (to replace with API):
 *    - 8 hardcoded fast food products with Unsplash images.
 *    - Price in Pakistani Rupees (Rs.) format.
 * 3. Route: /menu/fast-food
 * 4. Future: Load products via axios from GET /api/products?category=fastfood
 */
