import React from 'react';
import { ShoppingBag, DollarSign, Package, Users, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AdminDashboard Page
 * ====================
 * The main overview page of the admin panel.
 * Shows key business metrics at a glance.
 *
 * Sections:
 *   1. Stats Cards (Today's Orders, Revenue, Products, Staff)
 *   2. Recent Orders table
 *   3. Low Stock Alerts
 *   4. Best Selling Products
 *
 * Route: /admin
 */

// ── DUMMY DATA ───────────────────────────────────────────────
// TODO: Replace all dummy data below with real API calls using axios

// Stats — top 4 cards
// TODO: GET /api/dashboard/stats → { ordersToday, revenueToday, totalProducts, totalStaff }
const STATS = [
    { label: 'Orders Today',    value: '24',       sub: '+3 from yesterday', Icon: ShoppingBag, color: '#8B1A1A' },
    { label: 'Revenue Today',   value: 'Rs. 18,450', sub: '+12% vs last week',  Icon: DollarSign,  color: '#2D5A27' },
    { label: 'Total Products',  value: '87',       sub: '3 low stock',       Icon: Package,     color: '#1A4A8A' },
    { label: 'Total Staff',     value: '12',       sub: '1 on leave today',  Icon: Users,       color: '#7A4A00' },
];

// Recent Orders — last 5
// TODO: GET /api/orders?limit=5&sort=-createdAt → Order[]
const RECENT_ORDERS = [
    { id: 'ISB-001501', customer: 'Ahmed Raza',    total: 2400, status: 'Preparing',  branch: 'Branch 1', method: 'COD',    time: '11:45 AM' },
    { id: 'ISB-001500', customer: 'Fatima Bibi',   total: 850,  status: 'Confirmed',  branch: 'Branch 2', method: 'Online', time: '11:30 AM' },
    { id: 'ISB-001499', customer: 'Usman Khan',    total: 1600, status: 'Delivered',  branch: 'Branch 1', method: 'COD',    time: '10:55 AM' },
    { id: 'ISB-001498', customer: 'Sana Malik',    total: 3200, status: 'Pending',    branch: 'Branch 2', method: 'COD',    time: '10:20 AM' },
    { id: 'ISB-001497', customer: 'Bilal Hussain', total: 550,  status: 'Delivered',  branch: 'Branch 1', method: 'Cash',   time: '09:40 AM' },
];

// Low stock alerts
// TODO: GET /api/inventory?lowStock=true → Inventory[]
const LOW_STOCK = [
    { name: 'All-Purpose Flour', qty: 3, unit: 'kg',  minStock: 10, branch: 'Branch 1' },
    { name: 'Whipping Cream',    qty: 2, unit: 'L',   minStock: 5,  branch: 'Branch 2' },
    { name: 'Dark Chocolate',    qty: 1, unit: 'kg',  minStock: 4,  branch: 'Branch 1' },
];

// Best selling products
// TODO: GET /api/products?bestSellers=true&limit=3 → Product[]
const BEST_SELLERS = [
    { name: 'Black Forest Cake', sales: 42, revenue: 'Rs. 82,500' },
    { name: 'Zinger Burger',     sales: 78, revenue: 'Rs. 35,100' },
    { name: 'Gulab Jamun 1kg',   sales: 55, revenue: 'Rs. 27,500' },
];

// Maps order status to badge colors
const STATUS_COLORS = {
    Pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
    Preparing: 'bg-orange-100 text-orange-700 border border-orange-200',
    Delivered: 'bg-green-100 text-green-700 border border-green-200',
    Cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

function AdminDashboard() {
    return (
        <div className="space-y-6">

            {/* ══════════════════════════════════════════
                SECTION 1: STATS CARDS (Top Row)
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS.map(({ label, value, sub, Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            {/* Icon in a colored circle */}
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: color + '15' }}>
                                <Icon size={20} style={{ color }} />
                            </div>
                            <TrendingUp size={14} className="text-green-500" />
                        </div>
                        <p className="font-heading font-bold text-2xl text-text-dark">{value}</p>
                        <p className="font-body text-sm font-semibold text-text-light mt-0.5">{label}</p>
                        <p className="font-body text-xs text-text-light/70 mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                SECTION 2: RECENT ORDERS TABLE
            ══════════════════════════════════════════ */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-heading font-bold text-lg text-text-dark">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                                <th className="text-left px-6 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Order ID</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Customer</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Branch</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Total</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Method</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Status</th>
                                <th className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {RECENT_ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-6 py-3 font-bold text-primary text-xs">#{order.id}</td>
                                    <td className="px-4 py-3 text-text-dark font-semibold">{order.customer}</td>
                                    <td className="px-4 py-3 text-text-light text-xs">{order.branch}</td>
                                    <td className="px-4 py-3 font-bold text-text-dark">Rs. {order.total.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-text-light text-xs">{order.method}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-light text-xs">{order.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: LOW STOCK + BEST SELLERS (2 cols)
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-heading font-bold text-lg text-text-dark flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Low Stock Alerts
                        </h2>
                        <Link to="/admin/inventory" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                            Inventory <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {LOW_STOCK.map((item) => (
                            <div key={item.name} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-text-dark text-sm">{item.name}</p>
                                    <p className="text-xs text-text-light mt-0.5">{item.branch}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                        {item.qty} {item.unit} left
                                    </span>
                                    <p className="text-xs text-text-light mt-1">Min: {item.minStock} {item.unit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Selling Products */}
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="font-heading font-bold text-lg text-text-dark">Best Selling Products</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {BEST_SELLERS.map((product, index) => (
                            <div key={product.name} className="px-6 py-4 flex items-center gap-4">
                                {/* Rank number badge */}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                                    style={{ backgroundColor: '#8B1A1A' }}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-text-dark text-sm">{product.name}</p>
                                    <p className="text-xs text-text-light">{product.sales} sold this month</p>
                                </div>
                                <p className="font-bold text-primary text-sm">{product.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Data:  All hardcoded. Replace with axios.get('/api/dashboard/stats') etc.
 * 2. Route: /admin
 * 3. Layout: Wrapped by AdminLayout in App.jsx — sidebar + top bar come from there.
 * 4. Components: All inline — no sub-components needed for this page.
 */
