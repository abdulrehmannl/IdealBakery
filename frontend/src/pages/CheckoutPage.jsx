import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, CreditCard, Truck, CheckCircle, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';

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

    const [orderPlaced, setOrderPlaced] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Discount code state
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountError, setDiscountError] = useState('');
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

    // Handle input changes — updates the matching field in formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Cart and Auth Context
    const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Calculate order totals
    const subtotal = getCartTotal();
    
    // Calculate discount amount
    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.discountType === 'percentage') {
            discountAmount = subtotal * (appliedDiscount.value / 100);
        } else if (appliedDiscount.discountType === 'flat') {
            discountAmount = appliedDiscount.value;
        }
    }
    
    const discountedSubtotal = subtotal - discountAmount;
    const deliveryFee = discountedSubtotal >= 1000 || discountedSubtotal === 0 ? 0 : 150; // Free delivery over Rs. 1000
    const total = discountedSubtotal + deliveryFee;

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) return;
        setIsApplyingDiscount(true);
        setDiscountError('');
        try {
            const res = await api.post('/api/discounts/validate', { code: discountCode.trim() });
            if (res.data.success) {
                setAppliedDiscount(res.data.data);
            }
        } catch (err) {
            setDiscountError(err.response?.data?.message || 'Invalid or expired code.');
            setAppliedDiscount(null);
        } finally {
            setIsApplyingDiscount(false);
        }
    };

    // If cart is empty, redirect or show message
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
                <div className="text-center">
                    <ShoppingBag size={48} className="text-text-light mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Your cart is empty</h2>
                    <Link to="/menu" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">BROWSE MENU</Link>
                </div>
            </div>
        );
    }

    // Handle form submission
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const orderPayload = {
                items: cartItems.map(item => {
                    const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(item.id));
                    return {
                        product: isObjectId ? item.id : null,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price
                    };
                }),
                totalAmount: total,
                paymentMethod: paymentMethod === 'cod' ? 'cash' : 'online',
                address: `${formData.address}, ${formData.city}`,
                phone: formData.phone,
                customerName: formData.name,
                orderType: 'delivery',
                notes: formData.notes,
                discountCode: appliedDiscount ? appliedDiscount.title : null
            };

            const res = await api.post('/api/orders', orderPayload);
            if (res.data.success) {
                setOrderPlaced(res.data.data.orderNumber || res.data.data._id);
                clearCart();
            }
        } catch (err) {
            console.error('Failed to place order:', err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                        Your order has been received. We'll call you on <span className="font-bold text-text-dark">{formData.phone}</span> to confirm.
                    </p>
                    {/* Real order ID from backend */}
                    <div className="bg-secondary/60 border border-border rounded-xl p-4 mb-8">
                        <p className="text-xs text-text-light font-semibold tracking-widest uppercase mb-1">Order Reference</p>
                        <p className="font-heading font-bold text-xl text-primary">{orderPlaced}</p>
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
                                        <div key={`${item.id}-${item.size}`} className="flex gap-3 items-start relative">
                                            {/* Item thumbnail */}
                                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            {/* Item details */}
                                            <div className="flex-1 min-w-0 pr-6">
                                                <p className="font-bold text-sm text-text-dark leading-tight truncate">{item.name}</p>
                                                <p className="text-xs text-text-light mt-0.5">{item.size}</p>
                                                
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center border border-border rounded">
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                                                            className="px-2 py-0.5 hover:bg-secondary text-text-light"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="px-2 text-xs font-bold text-text-dark">{item.quantity}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                            className="px-2 py-0.5 hover:bg-secondary text-text-light"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <p className="font-bold text-primary text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Delete Button */}
                                            <button 
                                                type="button"
                                                onClick={() => removeFromCart(item.id, item.size)}
                                                className="absolute top-0 right-0 text-red-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="border-t border-border mt-5 pt-5 space-y-3">
                                    <div className="flex justify-between text-sm font-body">
                                        <span className="text-text-light">Subtotal</span>
                                        <span className="font-semibold text-text-dark">Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between text-sm font-body text-green-600">
                                            <span>Discount ({appliedDiscount.title})</span>
                                            <span className="font-semibold">- Rs. {discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-body">
                                        <span className="text-text-light flex items-center gap-1.5"><Truck size={13} /> Delivery</span>
                                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-text-dark'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                                        </span>
                                    </div>
                                    {deliveryFee > 0 && (
                                        <p className="text-xs text-text-light">Add Rs. {(1000 - discountedSubtotal).toLocaleString()} more for free delivery</p>
                                    )}
                                    <div className="flex justify-between border-t border-border pt-3">
                                        <span className="font-bold text-text-dark">Total</span>
                                        <span className="font-heading font-bold text-xl text-primary">Rs. {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                                <h2 className="font-heading text-lg font-bold text-text-dark mb-3">Promo Code</h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-2 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyDiscount}
                                        disabled={isApplyingDiscount || !discountCode.trim()}
                                        className="px-4 py-2 bg-text-dark text-white rounded-lg text-sm font-bold disabled:opacity-50"
                                    >
                                        {isApplyingDiscount ? '...' : 'APPLY'}
                                    </button>
                                </div>
                                {discountError && <p className="text-red-500 text-xs mt-2">{discountError}</p>}
                                {appliedDiscount && <p className="text-green-600 text-xs mt-2 font-bold">Discount applied!</p>}
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
