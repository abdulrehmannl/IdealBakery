import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, ChevronRight, Tag, Package, Clock } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';

/**
 * ProductDetailPage
 * =================
 * Shows the full details of a single product.
 * Accessed when a user clicks on a product to see more info.
 *
 * URL param: `id` from /product/:id
 * Example: /product/1 shows the product with id 1
 *
 * Route: /product/:id
 */
function ProductDetailPage() {
    // useParams extracts the `:id` from the URL
    // e.g., if URL is /product/3, then id = "3"
    const { id } = useParams();

    // Quantity selector state — starts at 1
    const [quantity, setQuantity] = useState(1);

    // Which size/variant is selected (for products with sizes)
    const [selectedSize, setSelectedSize] = useState('Regular');

    // Controls which tab is active in the details section below
    const [activeTab, setActiveTab] = useState('description');

    /*
     * DUMMY PRODUCT DATA
     * ------------------
     * TODO (Future API): Replace this entire block with:
     *   const [product, setProduct] = useState(null);
     *   useEffect(() => {
     *     axios.get(`/api/products/${id}`)
     *       .then(res => setProduct(res.data))
     *       .catch(err => console.error(err));
     *   }, [id]);
     *
     * The `id` from useParams() is used to look up the product.
     * For now, we show the same dummy product for any ID.
     */
    const product = {
        id: parseInt(id) || 1,
        name: 'Black Forest Birthday Cake',
        category: 'Bakery Items',
        categoryLink: '/menu/bakery',
        description:
            'Our signature Black Forest Cake is made with three layers of moist chocolate sponge, ' +
            'generously filled with freshly whipped cream and dark Morello cherries. The cake is ' +
            'finished with a dusting of premium dark chocolate shavings and a whole cherry on top. ' +
            'Perfect for birthdays, anniversaries, or any special celebration.',
        price: 2200,
        discount: 10,     // 10% off
        weight: '1 kg',
        stock: 8,
        tags: ['chocolate', 'cake', 'birthday', 'bestseller'],
        isAvailable: true,
        isSugarFree: false,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        badge: 'BESTSELLER',
        rating: 4.8,
        reviewCount: 124,
        sizes: ['Regular', 'Large', 'Extra Large'],
        sizePrices: { 'Regular': 2200, 'Large': 3200, 'Extra Large': 4500 },
        ingredients: 'Chocolate sponge, fresh whipped cream, Morello cherries, dark chocolate, butter, eggs, flour, sugar.',
        allergens: 'Contains wheat, dairy, eggs. May contain traces of nuts.',
        preparationTime: '24 hours advance notice required',
    };

    /*
     * RELATED PRODUCTS — shown below the main product
     * TODO: Fetch via GET /api/products?category=bakery&limit=4&exclude=<id>
     */
    const relatedProducts = [
        {
            id: 10, name: 'Red Velvet Cake', description: 'Layers of red velvet sponge with cream cheese frosting.',
            price: 'Rs. 2500', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=contain&w=500&q=80', badge: 'CUSTOMER FAV'
        },
        {
            id: 11, name: 'Marble Cake', description: 'Swirled vanilla and chocolate sponge with powdered sugar.',
            price: 'Rs. 1400', image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=contain&w=500&q=80', badge: null
        },
        {
            id: 12, name: 'Cinnamon Roll', description: 'Soft pillowy rolls with cinnamon sugar and cream cheese glaze.',
            price: 'Rs. 280', image: 'https://images.unsplash.com/photo-1551879400-111a9087cd86?auto=format&fit=contain&w=500&q=80', badge: 'NEW'
        },
        {
            id: 13, name: 'Fudge Brownie', description: 'Dense chocolatey fudge brownies with walnut chunks.',
            price: 'Rs. 320', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=contain&w=500&q=80', badge: null
        },
    ];

    // Calculate discounted price
    const discountedPrice = product.discount > 0
        ? Math.round(product.sizePrices[selectedSize] * (1 - product.discount / 100))
        : product.sizePrices[selectedSize];

    // Increase quantity — cap at stock limit
    const incrementQty = () => setQuantity((q) => Math.min(q + 1, product.stock));

    // Decrease quantity — minimum 1
    const decrementQty = () => setQuantity((q) => Math.max(q - 1, 1));

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F5F0EB' }}>

            {/* ══════════════════════════════════════════
                SECTION 1: BREADCRUMB BAR
            ══════════════════════════════════════════ */}
            <div className="bg-white border-b border-border px-6 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm font-body text-text-light">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
                    <ChevronRight size={14} />
                    <Link to={product.categoryLink} className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight size={14} />
                    {/* Current product — truncated if long name */}
                    <span className="text-text-dark font-semibold truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 2: PRODUCT MAIN AREA
                Left: Image | Right: Details + Controls
            ══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* ── Left Column: Product Image ── */}
                    <div className="relative">
                        {/* Badge on top-left of the image */}
                        {product.badge && (
                            <div className="absolute top-4 left-4 z-10 bg-text-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                {product.badge}
                            </div>
                        )}
                        {/* Discount badge on top-right */}
                        {product.discount > 0 && (
                            <div className="absolute top-4 right-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                {product.discount}% OFF
                            </div>
                        )}
                        {/* Main product image */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg aspect-square">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Sugar-free tag if applicable */}
                        {product.isSugarFree && (
                            <div className="mt-3 flex items-center gap-2">
                                <Tag size={14} className="text-green-600" />
                                <span className="text-green-700 text-sm font-bold">Sugar-Free Available</span>
                            </div>
                        )}
                    </div>

                    {/* ── Right Column: Product Details + Order Controls ── */}
                    <div className="flex flex-col gap-6">

                        {/* Category Tag */}
                        <Link
                            to={product.categoryLink}
                            className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit border border-primary/20 hover:bg-primary/20 transition-colors tracking-wider"
                        >
                            {product.category}
                        </Link>

                        {/* Product Name */}
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-dark leading-tight">
                            {product.name}
                        </h1>

                        {/* Star Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {/* Render 5 stars, filled based on rating */}
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        className={star <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="font-bold text-text-dark text-sm">{product.rating}</span>
                            <span className="text-text-light text-sm">({product.reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {/* Discounted price (or regular if no discount) */}
                            <span className="font-heading font-bold text-3xl text-primary">
                                Rs. {discountedPrice.toLocaleString()}
                            </span>
                            {/* Strike-through original price — only if there's a discount */}
                            {product.discount > 0 && (
                                <span className="text-text-light line-through text-lg font-body">
                                    Rs. {product.sizePrices[selectedSize].toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-border" />

                        {/* Size Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-text-dark mb-3">
                                Select Size
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-5 py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                                            selectedSize === size
                                                ? 'border-primary bg-primary text-white'   // active
                                                : 'border-border text-text-dark hover:border-primary hover:text-primary'  // inactive
                                        }`}
                                    >
                                        {size}
                                        <span className="block text-xs font-normal mt-0.5 opacity-80">
                                            Rs. {product.sizePrices[size].toLocaleString()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-text-dark mb-3">
                                Quantity
                            </label>
                            <div className="flex items-center gap-0 border-2 border-border rounded-lg w-fit overflow-hidden">
                                {/* Decrease button */}
                                <button
                                    onClick={decrementQty}
                                    disabled={quantity <= 1}
                                    className="px-4 py-3 hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Minus size={16} />
                                </button>
                                {/* Current quantity */}
                                <span className="px-6 py-3 font-bold text-text-dark text-lg border-x-2 border-border min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                {/* Increase button */}
                                <button
                                    onClick={incrementQty}
                                    disabled={quantity >= product.stock}
                                    className="px-4 py-3 hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {/* Show remaining stock warning if low */}
                            {product.stock <= 5 && (
                                <p className="text-sm text-amber-600 font-semibold mt-2">
                                    Only {product.stock} left in stock!
                                </p>
                            )}
                        </div>

                        {/* Total Price for selected qty */}
                        <div className="bg-secondary/60 rounded-xl p-4 border border-border/60 flex items-center justify-between">
                            <span className="font-body text-text-light text-sm">Total ({quantity} × Rs. {discountedPrice.toLocaleString()})</span>
                            <span className="font-heading font-bold text-xl text-primary">
                                Rs. {(discountedPrice * quantity).toLocaleString()}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {/* Add to Cart — currently logs to console, future: add to cart context */}
                            <button
                                onClick={() => console.log('Add to cart (dummy):', { product: product.name, quantity, size: selectedSize })}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary text-primary font-bold text-sm tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                                <ShoppingCart size={18} />
                                ADD TO CART
                            </button>
                            {/* Order Now — goes to checkout */}
                            <Link
                                to="/checkout"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] transition-colors shadow-lg"
                            >
                                ORDER NOW
                            </Link>
                        </div>

                        {/* Info Tags */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-text-light bg-white border border-border px-3 py-2 rounded-full">
                                <Package size={13} />
                                Weight: {product.weight}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-text-light bg-white border border-border px-3 py-2 rounded-full">
                                <Clock size={13} />
                                {product.preparationTime}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: DETAILS TABS
                Description | Ingredients | Allergens
            ══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 pb-12">
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

                    {/* Tab Headers */}
                    <div className="flex border-b border-border">
                        {['description', 'ingredients', 'allergens'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-bold text-sm tracking-wide capitalize transition-colors ${
                                    activeTab === tab
                                        ? 'border-b-2 border-primary text-primary bg-primary/5'
                                        : 'text-text-light hover:text-text-dark'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 font-body text-text-light leading-relaxed">
                        {activeTab === 'description' && <p>{product.description}</p>}
                        {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
                        {activeTab === 'allergens' && (
                            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                                ⚠️ {product.allergens}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 4: RELATED PRODUCTS
            ══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
                <h2 className="font-heading text-2xl font-bold text-text-dark mb-3">You Might Also Like</h2>
                <div className="w-10 h-1 bg-primary mb-8 rounded-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {relatedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>

        </div>
    );
}

export default ProductDetailPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - useParams() reads :id from the URL (/product/:id)
 *    - useState for quantity, selected size, active tab
 *    - Controlled quantity selector (Minus/Plus buttons with min/max limits)
 *    - Tab system for description, ingredients, allergens
 * 2. Dummy Data: Entire product is hardcoded. Size-based pricing calculated live.
 *    TODO: Fetch from GET /api/products/:id using the id from useParams()
 * 3. Route: /product/:id
 * 4. Future: ADD TO CART should dispatch to a cart context or Redux store.
 */
