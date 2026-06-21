import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, TrendingUp, AlertTriangle, ChevronRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_COLORS = {
    pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
    preparing: 'bg-orange-100 text-orange-700 border border-orange-200',
    delivered: 'bg-green-100 text-green-700 border border-green-200',
    cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

// Using dynamic stats from backend


function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/dashboard/stats');
            if (res.data.success) {
                setStats(res.data.data);
            } else {
                setError('Failed to fetch dashboard stats');
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Could not connect to the server');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center py-20"><RefreshCw className="animate-spin text-primary w-8 h-8" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 py-10">{error}</div>;
    }

    const STATS_DATA = [
        { label: 'Total Orders',    value: stats.totalOrders.toLocaleString(),       sub: 'All time', Icon: ShoppingBag, color: '#8B1A1A' },
        { label: 'Total Revenue',   value: `Rs. ${stats.totalRevenue.toLocaleString()}`, sub: 'All time',  Icon: DollarSign,  color: '#2D5A27' },
        { label: 'Customers',       value: stats.totalUsers.toLocaleString(),       sub: 'Registered', Icon: Users,     color: '#1A4A8A' },
        { label: 'Total Staff',     value: stats.totalStaff.toLocaleString(),       sub: 'Internal Users',  Icon: Users,       color: '#7A4A00' },
    ];

    return (
        <div className="space-y-6">

            {/* ══════════════════════════════════════════
                SECTION 0: LOW STOCK BANNER
            ══════════════════════════════════════════ */}
            {stats.lowStock && stats.lowStock.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg flex items-start gap-3 shadow-sm mb-6">
                    <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-bold text-red-800 text-sm">Low Stock Alert ({stats.lowStock.length} items)</h3>
                        <p className="text-xs text-red-700 mt-1">
                            {stats.lowStock.map(p => `${p.name} (${p.stock} left)`).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                SECTION 1: STATS CARDS (Top Row)
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS_DATA.map(({ label, value, sub, Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
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
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-6 py-3 font-bold text-primary text-xs">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                    <td className="px-4 py-3 text-text-dark font-semibold">{order.customer?.name || 'Walk-in'}</td>
                                    <td className="px-4 py-3 text-text-light text-xs">{order.branch?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 font-bold text-text-dark">Rs. {order.totalAmount?.toLocaleString() || 0}</td>
                                    <td className="px-4 py-3 text-text-light text-xs capitalize">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-light text-xs">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-text-light">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 3: LOW STOCK + BEST SELLERS
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-heading font-bold text-lg text-text-dark flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Low Stock Alerts
                        </h2>
                    </div>
                    <div className="divide-y divide-border">
                        {stats.lowStock?.map((item) => (
                            <div key={item._id} className="px-6 py-4 flex items-center justify-between opacity-50">
                                <div>
                                    <p className="font-bold text-text-dark text-sm">{item.name}</p>
                                    <p className="text-xs text-text-light mt-0.5">{item.branch?.map(b => b.name).join(', ') || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                        {item.stock} {item.weight || 'units'} left
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!stats.lowStock || stats.lowStock.length === 0) && (
                            <div className="px-6 py-4 text-sm text-text-light text-center">No low stock items.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="font-heading font-bold text-lg text-text-dark">Best Selling Products</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {stats.bestSellers?.map((product, index) => (
                            <div key={product.name} className="px-6 py-4 flex items-center gap-4 opacity-50">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                                    style={{ backgroundColor: '#8B1A1A' }}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-text-dark text-sm">{product.name}</p>
                                    <p className="text-xs text-text-light">{product.sales} sold all time</p>
                                </div>
                                <p className="font-bold text-primary text-sm">{product.revenue}</p>
                            </div>
                        ))}
                        {(!stats.bestSellers || stats.bestSellers.length === 0) && (
                            <div className="px-6 py-4 text-sm text-text-light text-center">No sales data.</div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;
