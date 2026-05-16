import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, CreditCard, Truck, CheckCircle, ShoppingBag, Trash2 } from 'lucide-react';

/**
 * CheckoutPage
 * ============
 * The order placement page. Shows:
 *   1. Order summary (items, subtotal, delivery fee, total)
 *   2. Delivery details form (name, address, phone)
 *   3. Payment method selector (Cash on Delivery / Online)
 *   4. "Place Order" button
 *
 * Route: /checkout
 */
function CheckoutPage() {
    // ── Delivery Form State ─────────────────────────────────────
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Sahiwal',  // Default to Sahiwal since that's where the bakery operates
        notes: '',
    });

    // Which payment method is selected
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'

    // Whether the order was successfully placed
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes — updates the matching field in formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /*
     * DUMMY CART ITEMS
     * -----------------
     * TODO (Future): Replace with real cart data from a CartContext or global state.
     * Each item matches the MongoDB Order + OrderItem schema structure.
     */
    const cartItems = [
        {
            id: 1,
            name: 'Black Forest Cake',
            size: 'Regular (1kg)',
            price: 1980,  // Already discounted (2200 - 10%)
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=contain&w=200&q=80',
        },
        {
            id: 2,
            name: 'Zinger Burger',
            size: 'Standard',
            price: 450,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=contain&w=200&q=80',
        },
    ];

    // Calculate order totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 1000 ? 0 : 150; // Free delivery over Rs. 1000
    const total = subtotal + deliveryFee;

    // Handle form submission
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsLoading(true);

        /*
         * DUMMY ORDER SUBMISSION
         * ----------------------
         * TODO (Future API): Replace with:
         *   axios.post('/api/orders', {
         *     items: cartItems,
         *     deliveryDetails: formData,
         *     paymentMethod,
         *     total,
         *   })
         *   .then(res => { setOrderPlaced(true); })
         *   .catch(err => console.error(err));
         */
        console.log('Order placed (dummy):', { cartItems, formData, paymentMethod, total });

        setTimeout(() => {
            setIsLoading(false);
            setOrderPlaced(true); // Show success screen
        }, 2000);
    };

    // ── ORDER SUCCESS SCREEN ──────────────────────────────────────
    if (orderPlaced) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-6 py-12 font-body"
                style={{ backgroundColor: '#F5F0EB' }}
            >
                <div className="max-w-md w-full bg-white rounded-2xl border border-border shadow-2xl p-10 text-center">
                    {/* Big green checkmark */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                            <CheckCircle size={50} className="text-green-500" />
                        </div>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-text-dark mb-3">Order Placed!</h2>
                    <p className="font-body text-text-light mb-2">
                        Thank you, <span className="font-bold text-text-dark">{formData.name || 'valued customer'}</span>!
                    </p>
                    <p className="font-body text-text-light text-sm mb-8">
                        Your order of <span className="font-bold text-primary">Rs. {total.toLocaleString()}</span> has been received. We'll call you on <span className="font-bold text-text-dark">{formData.phone}</span> to confirm.
                    </p>
                    {/* Dummy order ID — backend will generate a real one */}
                    <div className="bg-secondary/60 border border-border rounded-xl p-4 mb-8">
                        <p className="text-xs text-text-light font-semibold tracking-widest uppercase mb-1">Order Reference</p>
                        <p className="font-heading font-bold text-xl text-primary">#ISB-{Date.now().toString().slice(-6)}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/order-tracking"
                            className="block w-full bg-primary text-white py-3 rounded-lg font-bold text-sm tracking-widest hover:bg-[#6A1414] transition-colors"
                        >
                            TRACK MY ORDER
                        </Link>
                        <Link
                            to="/"
                            className="block w-full border-2 border-primary text-primary py-3 rounded-lg font-bold text-sm tracking-widest hover:bg-primary hover:text-white transition-colors"
                        >
                            BACK TO HOME
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── CHECKOUT FORM ──────────────────────────────────────────────
    return (
        <div className="min-h-screen font-body py-10 px-4 md:px-8" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="max-w-6xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-text-dark">Checkout</h1>
                    <div className="w-10 h-1 bg-primary mt-3 rounded-full" />
                </div>

                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── LEFT COLUMN: Delivery Details (takes 2 of 3 cols) ── */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* Delivery Details Card */}
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                                <h2 className="font-heading text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary" />
                                    Delivery Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-text-dark mb-1.5">Full Name *</label>
                                        <input
                                            type="text" name="name" required
                                            value={formData.name} onChange={handleInputChange}
                                            placeholder="Your full name"
                                            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-text-dark mb-1.5">Phone Number *</label>
                                        <input
                                            type="tel" name="phone" required
                                            value={formData.phone} onChange={handleInputChange}
                                            placeholder="03XX-XXXXXXX"
                                            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                    {/* Delivery Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-text-dark mb-1.5">Delivery Address *</label>
                                        <input
                                            type="text" name="address" required
                                            value={formData.address} onChange={handleInputChange}
                                            placeholder="Street, Block, Area"
                                            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-semibold text-text-dark mb-1.5">City</label>
                                        <input
                                            type="text" name="city"
                                            value={formData.city} onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                    {/* Special Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-text-dark mb-1.5">Special Notes (Optional)</label>
                                        <input
                                            type="text" name="notes"
                                            value={formData.notes} onChange={handleInputChange}
                                            placeholder="E.g., leave at door, call on arrival"
                                            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Card */}
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                                <h2 className="font-heading text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
                                    <CreditCard size={20} className="text-primary" />
                                    Payment Method
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Cash on Delivery option */}
                                    <label className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                                        <input
                                            type="radio" name="payment" value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="accent-primary w-4 h-4"
                                        />
                                        <div>
                                            <p className="font-bold text-text-dark text-sm">Cash on Delivery</p>
                                            <p className="text-xs text-text-light mt-0.5">Pay when your order arrives</p>
                                        </div>
                                    </label>

                                    {/* Online payment option */}
                                    <label className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                                        <input
                                            type="radio" name="payment" value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={() => setPaymentMethod('online')}
                                            className="accent-primary w-4 h-4"
                                        />
                                        <div>
                                            <p className="font-bold text-text-dark text-sm">Online Payment</p>
                                            <p className="text-xs text-text-light mt-0.5">EasyPaisa / JazzCash / Bank</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Order Summary (1 of 3 cols) ── */}
                        <div className="flex flex-col gap-5">

                            {/* Cart Items */}
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                                <h2 className="font-heading text-xl font-bold text-text-dark mb-5 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-primary" />
                                    Your Order
                                </h2>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-start">
                                            {/* Item thumbnail */}
                                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            {/* Item details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-text-dark leading-tight truncate">{item.name}</p>
                                                <p className="text-xs text-text-light mt-0.5">{item.size} × {item.quantity}</p>
                                                <p className="font-bold text-primary text-sm mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="border-t border-border mt-5 pt-5 space-y-3">
                                    <div className="flex justify-between text-sm font-body">
                                        <span className="text-text-light">Subtotal</span>
                                        <span className="font-semibold text-text-dark">Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-body">
                                        <span className="text-text-light flex items-center gap-1.5"><Truck size={13} /> Delivery</span>
                                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-text-dark'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                                        </span>
                                    </div>
                                    {deliveryFee > 0 && (
                                        <p className="text-xs text-text-light">Add Rs. {(1000 - subtotal).toLocaleString()} more for free delivery</p>
                                    )}
                                    <div className="flex justify-between border-t border-border pt-3">
                                        <span className="font-bold text-text-dark">Total</span>
                                        <span className="font-heading font-bold text-xl text-primary">Rs. {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold text-sm tracking-widest rounded-xl hover:bg-[#6A1414] transition-colors shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <CheckCircle size={18} />
                                )}
                                {isLoading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                            </button>

                            <p className="text-xs text-text-light text-center">
                                By placing your order, you agree to our{' '}
                                <a href="#" className="text-primary underline">Terms of Service</a>.
                            </p>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Controlled form with a single `formData` state object updated via `handleInputChange`.
 *    - Radio buttons for payment method selection.
 *    - Conditional rendering: shows success screen after order, form before.
 *    - Live total calculation: subtotal + delivery fee (waived if order > Rs. 1000).
 * 2. Dummy Data:
 *    - `cartItems` is hardcoded. TODO: Replace with CartContext or state management.
 *    - TODO: Submit via axios.post('/api/orders', orderData).
 * 3. Route: /checkout
 */
