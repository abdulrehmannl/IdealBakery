import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, ChevronRight, MapPin } from 'lucide-react';

/**
 * OrderTrackingPage
 * =================
 * Allows customers to track the status of their order.
 * They enter their order ID and phone number to look up the order.
 *
 * Shows a visual timeline with 4 steps:
 *   Order Placed → Being Prepared → Out for Delivery → Delivered
 *
 * Route: /order-tracking
 */
function OrderTrackingPage() {
    // ── Input State ─────────────────────────────────────────────
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // When not null, shows the order tracking result
    // When null, shows the search form
    const [trackedOrder, setTrackedOrder] = useState(null);

    // Error message if the order is not found
    const [error, setError] = useState('');

    /*
     * Tracking statuses in order from first to last.
     * The `completed` and `active` flags control which steps are colored/active.
     * TODO: These will be driven by the Order schema's `status` field from the backend.
     */
    const allSteps = [
        { key: 'placed',    label: 'Order Placed',      icon: Package,      description: 'We received your order.' },
        { key: 'preparing', label: 'Being Prepared',    icon: Clock,        description: 'Our bakers are preparing your order.' },
        { key: 'delivery',  label: 'Out for Delivery',  icon: Truck,        description: 'Your order is on its way!' },
        { key: 'delivered', label: 'Delivered',         icon: CheckCircle,  description: 'Enjoy your order!' },
    ];

    // ── Handle Search Submit ────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        /*
         * DUMMY ORDER LOOKUP — NO REAL API CALL YET
         * ------------------------------------------
         * TODO (Future API): Replace with:
         *   axios.get(`/api/orders/track?orderId=${orderId}&phone=${phone}`)
         *     .then(res => setTrackedOrder(res.data))
         *     .catch(err => {
         *       setError('Order not found. Please check your order ID and phone number.');
         *       setIsLoading(false);
         *     });
         *
         * The response should match the MongoDB Order schema:
         *   { _id, status, items, deliveryAddress, createdAt, estimatedDelivery }
         */
        setTimeout(() => {
            setIsLoading(false);

            // Dummy: any order ID starting with "ISB" is "found"
            if (orderId.toUpperCase().startsWith('ISB') || orderId.length >= 4) {
                setTrackedOrder({
                    id: orderId.toUpperCase(),
                    currentStatus: 'preparing', // This maps to allSteps[1]
                    customerName: 'Muhammad Abdullah',
                    phone: phone || '0323-4404773',
                    items: [
                        { name: 'Black Forest Cake', qty: 1, price: 1980 },
                        { name: 'Zinger Burger', qty: 2, price: 900 },
                    ],
                    deliveryAddress: 'Dawood Chowk, Karbala Road, Sahiwal',
                    placedAt: '2026-04-05 at 11:30 AM',
                    estimatedDelivery: '2026-04-05 between 1:00 PM – 3:00 PM',
                    total: 2880,
                });
            } else {
                setError('Order not found. Please check your Order ID and phone number.');
            }
        }, 1500);
    };

    // ── Gets which steps are completed/active based on current status ──
    const getStepState = (stepKey) => {
        if (!trackedOrder) return 'inactive';
        const statusOrder = ['placed', 'preparing', 'delivery', 'delivered'];
        const currentIdx = statusOrder.indexOf(trackedOrder.currentStatus);
        const stepIdx = statusOrder.indexOf(stepKey);
        if (stepIdx < currentIdx) return 'completed'; // steps before current
        if (stepIdx === currentIdx) return 'active';   // current step
        return 'inactive';                              // future steps
    };

    return (
        <div className="min-h-screen font-body py-10 px-4 md:px-8" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="max-w-3xl mx-auto">

                {/* ── Page Header ── */}
                <div className="text-center mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-dark">Track Your Order</h1>
                    <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
                    <p className="font-body text-text-light mt-4">
                        Enter your Order ID and phone number to check your delivery status.
                    </p>
                </div>

                {/* ══════════════════════════════════════════
                    SEARCH FORM
                ══════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl border border-border shadow-md p-6 md:p-8 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Order ID Input */}
                            <div>
                                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                                    Order ID
                                </label>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. ISB-123456"
                                    required
                                    className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                            {/* Phone Number Input */}
                            <div>
                                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="03XX-XXXXXXX"
                                    className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search size={16} />
                            )}
                            {isLoading ? 'SEARCHING...' : 'TRACK ORDER'}
                        </button>
                    </form>
                </div>

                {/* ══════════════════════════════════════════
                    ORDER RESULT — only shown when found
                ══════════════════════════════════════════ */}
                {trackedOrder && (
                    <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden">

                        {/* Order Header */}
                        <div className="bg-primary text-white px-6 py-5 flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-xs font-semibold tracking-widest mb-1">ORDER ID</p>
                                <p className="font-heading font-bold text-xl">#{trackedOrder.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 text-xs font-semibold tracking-widest mb-1">PLACED ON</p>
                                <p className="text-sm font-semibold">{trackedOrder.placedAt}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">

                            {/* ── Status Timeline ── */}
                            <div className="mb-8">
                                <h3 className="font-heading font-bold text-lg text-text-dark mb-6">Delivery Status</h3>

                                <div className="relative">
                                    {allSteps.map((step, index) => {
                                        const state = getStepState(step.key);
                                        const Icon = step.icon;
                                        const isLast = index === allSteps.length - 1;

                                        return (
                                            <div key={step.key} className="flex items-start gap-4 relative">
                                                {/* Icon circle */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-colors ${
                                                    state === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                                    state === 'active'    ? 'bg-primary border-primary text-white' :
                                                    'bg-white border-border text-text-light'
                                                }`}>
                                                    <Icon size={18} />
                                                </div>

                                                {/* Step info */}
                                                <div className={`pb-8 flex-1 ${isLast ? 'pb-0' : ''}`}>
                                                    <p className={`font-bold text-sm ${state !== 'inactive' ? 'text-text-dark' : 'text-text-light'}`}>
                                                        {step.label}
                                                        {state === 'active' && (
                                                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                                                CURRENT
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className={`text-xs mt-1 ${state !== 'inactive' ? 'text-text-light' : 'text-text-light/50'}`}>
                                                        {step.description}
                                                    </p>
                                                </div>

                                                {/* Vertical connector line between steps */}
                                                {!isLast && (
                                                    <div className={`absolute left-5 top-10 w-0.5 h-full -translate-x-0.5 ${
                                                        getStepState(allSteps[index + 1].key) !== 'inactive' ? 'bg-green-400' : 'bg-border'
                                                    }`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Estimated Delivery */}
                            <div className="bg-secondary/60 border border-border rounded-xl p-4 mb-6 flex items-start gap-3">
                                <Truck size={18} className="text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-text-light tracking-widest uppercase mb-0.5">Estimated Delivery</p>
                                    <p className="font-bold text-text-dark text-sm">{trackedOrder.estimatedDelivery}</p>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="flex items-start gap-3 mb-6">
                                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-text-light tracking-widest uppercase mb-0.5">Delivery To</p>
                                    <p className="font-bold text-text-dark text-sm">{trackedOrder.deliveryAddress}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-border pt-6">
                                <h4 className="font-heading font-bold text-base text-text-dark mb-4">Order Items</h4>
                                <div className="space-y-3">
                                    {trackedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-text-dark font-semibold">{item.name} <span className="text-text-light font-normal">× {item.qty}</span></span>
                                            <span className="font-bold text-primary">Rs. {item.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center border-t border-border pt-3 font-bold">
                                        <span className="text-text-dark">Total</span>
                                        <span className="text-primary font-heading text-lg">Rs. {trackedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default OrderTrackingPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - `trackedOrder` state is null by default; set after successful "API" call.
 *    - `getStepState()` function maps the current order status to each step's visual state.
 *    - Visual timeline built with flex + absolute vertical line between steps.
 * 2. Dummy Data:
 *    - Any Order ID of 4+ chars will "find" a dummy order.
 *    - TODO: Replace with GET /api/orders/track?orderId=...&phone=...
 * 3. Route: /order-tracking
 */
