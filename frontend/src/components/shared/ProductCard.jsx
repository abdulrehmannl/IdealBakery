import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * ProductCard Component (Shared — used in all category pages)
 * ============================================================
 * Renders a single product card with:
 *   - An optional badge (e.g., "BESTSELLER", "NEW")
 *   - Clickable image area → goes to /product/:id (Product Detail Page)
 *   - Product name, description, and price
 *   - "VIEW DETAILS" button → goes to /product/:id (Product Detail Page)
 *   - "ORDER NOW" button → goes to /checkout (Checkout Page)
 *
 * This is the EXACT same card design as the Bestsellers section
 * on the homepage — ensuring visual consistency across all pages.
 *
 * Props:
 *   product = {
 *     id:          number   — unique identifier (used in /product/:id route)
 *     name:        string   — product name
 *     description: string   — short product description
 *     price:       string   — formatted price e.g. "Rs. 1200"
 *     image:       string   — image URL
 *     badge:       string   — optional label (can be null/omitted)
 *   }
 */
function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleOrderNow = () => {
        // Strip out "Rs." and parse the number (since price in product card might be string, but cart expects number)
        const parsedPrice = typeof product.price === 'string' ? Number(product.price.replace(/[^0-9.-]+/g,"")) : product.price;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: parsedPrice,
            image: product.image
        }, 1, 'Regular');
        
        navigate('/checkout');
    };

    return (
        /*
         * The outer div is the card container.
         * We do NOT wrap the whole card in a <Link> because we have
         * TWO different link targets (detail page & checkout page).
         * Instead, the image and name link to the detail page, and
         * the ORDER NOW button links to checkout.
         */
        <div className="group flex flex-col h-full bg-secondary rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative">

            {/* ── Optional Badge (top-left corner) ── */}
            {/* Only renders if the product object has a 'badge' property */}
            {product.badge && (
                <div className="absolute top-3 left-3 bg-text-dark text-white px-3 py-1 font-bold text-xs rounded-full z-10 shadow-sm">
                    {product.badge}
                </div>
            )}

            {/* ── Product Image Area ── */}
            {/*
             * Wrapped in a <Link> to the product detail page.
             * Clicking the image opens the full product details.
             * /product/:id — the :id param comes from product.id
             */}
            <Link to={`/product/${product.id}`} className="block">
                <div className="h-40 md:h-48 bg-secondary p-4 flex items-center justify-center overflow-hidden relative border-b border-border">
                    <img
                        src={product.image}
                        alt={product.name}
                        // mix-blend-multiply removes white background from product photos
                        // so they blend into the cream (#F5F0EB) card background naturally
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    />
                </div>
            </Link>

            {/* ── Product Info Area ── */}
            <div className="p-6 flex flex-col flex-1 text-center bg-white">

                {/*
                 * Product Name — also a Link to the product detail page.
                 * Clicking the name opens the full product detail page.
                 */}
                <Link
                    to={`/product/${product.id}`}
                    className="font-heading font-bold text-xl text-text-dark mb-2 hover:text-primary transition-colors block"
                >
                    {product.name}
                </Link>

                {/* Product Description — limited to 2 lines to keep cards equal height */}
                <p className="font-body text-text-light text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Price + Buttons — pushed to the bottom with mt-auto */}
                <div className="mt-auto flex flex-col gap-3 items-center w-full">

                    {/* Price display */}
                    <span className="font-bold text-primary text-lg">{product.price}</span>

                    {/*
                     * TWO ACTION BUTTONS:
                     * 1. "VIEW DETAILS" → Product Detail Page (/product/:id)
                     *    Lets the user select size, quantity, and read full description.
                     * 2. "ORDER NOW" → Checkout Page (/checkout)
                     *    Skips to checkout for quick ordering.
                     *
                     * Both use React Router <Link> — NO page reloads.
                     */}

                    {/* View Details button (outlined style) */}
                    <Link
                        to={`/product/${product.id}`}
                        className="w-full px-4 py-2.5 border-2 border-primary text-primary font-bold text-sm tracking-wide hover:bg-primary hover:text-white transition-colors rounded text-center"
                    >
                        VIEW DETAILS
                    </Link>

                    {/* Order Now button (filled style) */}
                    <button
                        onClick={handleOrderNow}
                        className="w-full px-4 py-2.5 bg-primary text-white font-bold text-sm tracking-wide hover:bg-[#6A1414] transition-colors rounded text-center block"
                    >
                        ORDER NOW
                    </button>

                </div>
            </div>

        </div>
    );
}

export default ProductCard;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - React Router <Link> makes navigation happen without full page reload (SPA behaviour).
 *    - Template literal `/product/${product.id}` builds the dynamic URL for each product.
 *    - Two separate Link targets on one card (detail page + checkout page).
 *    - `line-clamp-2` truncates long descriptions — requires Tailwind CSS v4 support.
 *    - `mix-blend-multiply` blends product image into the cream background.
 *    - `mt-auto` pushes the price & buttons to the very bottom regardless of description length.
 *
 * 2. Navigation flow:
 *    - Image click or "VIEW DETAILS" → /product/:id → ProductDetailPage
 *    - "ORDER NOW" button → /checkout → CheckoutPage
 *
 * 3. Dynamic Data:
 *    - Product data comes from the parent page (category pages, special pages, etc.)
 *    - Real data comes from API: GET /api/products and GET /api/products/:id
 *
 * 4. Future improvements:
 *    - Add "ADD TO CART" button that dispatches to a Cart context/state.
 *    - Pass product data to checkout via URL state or cart context when clicking ORDER NOW.
 */
