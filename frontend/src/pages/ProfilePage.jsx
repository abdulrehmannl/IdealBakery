import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, ShoppingBag, Edit2, Save, LogOut, Package, ChevronRight } from 'lucide-react';

/**
 * ProfilePage
 * ===========
 * Shows the logged-in user's profile information and order history.
 * Allows editing name and phone number.
 *
 * Route: /profile
 *
 * Note: This page is NOT protected yet. In the future, wrap it with
 * an AuthGuard component that redirects to /login if no token exists.
 */
function ProfilePage() {
    // ── Edit Mode ──────────────────────────────────────────────
    // When true, shows input fields instead of display text
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /*
     * DUMMY USER DATA
     * ---------------
     * TODO (Future API): Replace with:
     *   const [user, setUser] = useState(null);
     *   useEffect(() => {
     *     axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
     *       .then(res => setUser(res.data))
     *   }, []);
     */
    const [userData, setUserData] = useState({
        name: 'Muhammad Abdullah',
        email: 'abdullah@example.com',  // Email is NOT editable (used as login key)
        phone: '0323-4404773',
    });

    // Temporary edit values (only committed when Save is clicked)
    const [editData, setEditData] = useState({ ...userData });

    // Handle save
    const handleSave = () => {
        setIsSaving(true);
        /*
         * TODO (Future API): Replace with:
         *   axios.put('/api/users/profile', editData, { headers: { Authorization: `Bearer ${token}` } })
         *     .then(() => { setUserData(editData); setIsEditing(false); })
         */
        setTimeout(() => {
            setUserData(editData);
            setIsEditing(false);
            setIsSaving(false);
        }, 1000);
    };

    // Cancel edits — revert editData to the last saved userData
    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
    };

    /*
     * DUMMY ORDER HISTORY
     * --------------------
     * TODO (Future API): Replace with:
     *   GET /api/orders?userId=<id>
     * Maps to the MongoDB Order schema: { _id, status, total, createdAt, items[] }
     */
    const orders = [
        {
            id: 'ISB-001234',
            date: 'April 4, 2026',
            status: 'Delivered',
            statusColor: 'text-green-600 bg-green-50 border-green-200',
            items: ['Black Forest Cake', 'Zinger Burger × 2'],
            total: 2880,
        },
        {
            id: 'ISB-001098',
            date: 'March 28, 2026',
            status: 'Delivered',
            statusColor: 'text-green-600 bg-green-50 border-green-200',
            items: ['Gulab Jamun 1kg', 'Ras Malai'],
            total: 1050,
        },
        {
            id: 'ISB-000876',
            date: 'March 15, 2026',
            status: 'Delivered',
            statusColor: 'text-green-600 bg-green-50 border-green-200',
            items: ['Mithai Gift Box (Large)'],
            total: 2500,
        },
    ];

    return (
        <div className="min-h-screen font-body py-10 px-4 md:px-8" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="max-w-4xl mx-auto">

                {/* ══════════════════════════════════════════
                    SECTION 1: PROFILE CARD
                ══════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden mb-8">

                    {/* Maroon header banner */}
                    <div className="bg-primary px-6 py-6 flex items-center gap-4">
                        {/* Avatar circle with initials */}
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/40">
                            <span className="font-heading font-bold text-2xl text-white">
                                {/* Show first letter of the user's name */}
                                {userData.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-white">{userData.name}</h1>
                            <p className="text-white/70 text-sm font-body">{userData.email}</p>
                        </div>
                        {/* Edit/Save buttons in top-right */}
                        <div className="ml-auto flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-xs font-bold text-white/80 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-primary rounded-lg hover:bg-secondary transition-colors disabled:opacity-60"
                                    >
                                        {isSaving ? (
                                            <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        ) : (
                                            <Save size={13} />
                                        )}
                                        SAVE
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <Edit2 size={13} />
                                    EDIT PROFILE
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Full Name */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-text-light tracking-widest uppercase mb-2">
                                <User size={13} /> Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            ) : (
                                <p className="font-semibold text-text-dark">{userData.name}</p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-text-light tracking-widest uppercase mb-2">
                                <Mail size={13} /> Email Address
                            </label>
                            <p className="font-semibold text-text-dark">{userData.email}</p>
                            <p className="text-xs text-text-light mt-0.5">Email cannot be changed</p>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-text-light tracking-widest uppercase mb-2">
                                <Phone size={13} /> Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.phone}
                                    onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            ) : (
                                <p className="font-semibold text-text-dark">{userData.phone}</p>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col gap-3 justify-end">
                            <Link
                                to="/order-tracking"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-[#6A1414] transition-colors"
                            >
                                <Package size={14} /> Track an Order <ChevronRight size={14} />
                            </Link>
                            {/* Logout button — currently just logs to console */}
                            <button
                                onClick={() => {
                                    console.log('Logout clicked (dummy) — TODO: clear token and redirect to /login');
                                }}
                                className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors w-fit"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    SECTION 2: ORDER HISTORY
                ══════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden">

                    <div className="px-6 py-5 border-b border-border flex items-center gap-2">
                        <ShoppingBag size={18} className="text-primary" />
                        <h2 className="font-heading font-bold text-xl text-text-dark">Order History</h2>
                    </div>

                    <div className="divide-y divide-border">
                        {orders.map((order) => (
                            <div key={order.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-text-dark text-sm">#{order.id}</span>
                                        {/* Status badge */}
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-light mb-2">{order.date}</p>
                                    {/* Item list condensed */}
                                    <p className="text-sm text-text-dark font-semibold">
                                        {order.items.join(' · ')}
                                    </p>
                                </div>
                                {/* Right side: total + reorder */}
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="font-heading font-bold text-lg text-primary">
                                        Rs. {order.total.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => console.log('Reorder (dummy):', order.id)}
                                        className="px-4 py-2 border-2 border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                                    >
                                        REORDER
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state — shown if no orders */}
                    {orders.length === 0 && (
                        <div className="py-16 text-center">
                            <ShoppingBag size={48} className="text-border mx-auto mb-4" />
                            <p className="font-body text-text-light">You haven't placed any orders yet.</p>
                            <Link to="/menu" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm tracking-widest hover:bg-[#6A1414] transition-colors">
                                BROWSE MENU
                            </Link>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default ProfilePage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Toggle edit mode with `isEditing` state.
 *    - Separate `editData` state — only committed to `userData` on Save (prevents live mutation).
 *    - Avatar initials from first letter of name.
 *    - Reusable status badge using dynamic Tailwind classes.
 * 2. Dummy Data:
 *    - User data and order history are hardcoded.
 *    - TODO: Fetch user from GET /api/users/profile with JWT token in header.
 *    - TODO: Fetch orders from GET /api/orders?userId=<id>
 * 3. Route: /profile
 * 4. Future: Add auth guard — if no token in localStorage, redirect to /login.
 */
