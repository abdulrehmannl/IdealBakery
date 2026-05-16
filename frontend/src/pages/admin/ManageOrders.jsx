import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

/**
 * ManageOrders Page
 * ==================
 * Lets admin staff view all orders, filter by status, and update order status.
 * Route: /admin/orders
 *
 * TODO: Connect to:
 *   GET  /api/orders               → load all orders
 *   PUT  /api/orders/:id/status    → update status of an order
 */

// ── DUMMY DATA ──────────────────────────────────────────────────────────────
// TODO: Replace with real data from GET /api/orders
// Fields match the Order mongoose schema:
//   customer, branch, totalAmount, status, orderType, paymentMethod, address, phone
const INITIAL_ORDERS = [
  {
    id: 'ISB-001501',
    customer: 'Ahmed Raza',
    phone: '0300-1234567',
    branch: 'Branch 1',
    items: [{ name: 'Black Forest Cake', qty: 1, price: 2200 }, { name: 'Zinger Burger', qty: 1, price: 450 }],
    totalAmount: 2650,
    status: 'Preparing',
    orderType: 'Delivery',
    paymentMethod: 'COD',
    address: 'House 12, Street 5, Madina Colony, Sahiwal',
    date: '2026-04-05',
    time: '11:45 AM',
  },
  {
    id: 'ISB-001500',
    customer: 'Fatima Bibi',
    phone: '0311-9876543',
    branch: 'Branch 2',
    items: [{ name: 'Gulab Jamun 1kg', qty: 1, price: 500 }, { name: 'Mango Milkshake', qty: 2, price: 440 }],
    totalAmount: 940,
    status: 'Confirmed',
    orderType: 'Pickup',
    paymentMethod: 'Online',
    address: 'N/A',
    date: '2026-04-05',
    time: '11:30 AM',
  },
  {
    id: 'ISB-001499',
    customer: 'Usman Khan',
    phone: '0321-5555555',
    branch: 'Branch 1',
    items: [{ name: 'Chocolate Brownie', qty: 3, price: 960 }, { name: 'Vanilla Ice Cream', qty: 2, price: 360 }],
    totalAmount: 1320,
    status: 'Delivered',
    orderType: 'Delivery',
    paymentMethod: 'COD',
    address: 'Plot 7, Arra Tulla Road, Sahiwal',
    date: '2026-04-05',
    time: '10:55 AM',
  },
  {
    id: 'ISB-001498',
    customer: 'Sana Malik',
    phone: '0333-7777777',
    branch: 'Branch 2',
    items: [{ name: 'Black Forest Cake', qty: 2, price: 4400 }],
    totalAmount: 4400,
    status: 'Pending',
    orderType: 'Delivery',
    paymentMethod: 'COD',
    address: 'Karbala Road, Sahiwal',
    date: '2026-04-05',
    time: '10:20 AM',
  },
  {
    id: 'ISB-001497',
    customer: 'Bilal Hussain',
    phone: '0345-2020202',
    branch: 'Branch 1',
    items: [{ name: 'Vanilla Ice Cream', qty: 3, price: 540 }],
    totalAmount: 540,
    status: 'Delivered',
    orderType: 'Pickup',
    paymentMethod: 'Cash',
    address: 'N/A',
    date: '2026-04-04',
    time: '09:40 AM',
  },
  {
    id: 'ISB-001496',
    customer: 'Ayesha Nawaz',
    phone: '0300-8080808',
    branch: 'Branch 2',
    items: [{ name: 'Zinger Burger', qty: 2, price: 900 }, { name: 'Fries', qty: 2, price: 300 }],
    totalAmount: 1200,
    status: 'Cancelled',
    orderType: 'Delivery',
    paymentMethod: 'Online',
    address: 'House 3, Model Town, Sahiwal',
    date: '2026-04-04',
    time: '08:15 AM',
  },
  {
    id: 'ISB-001495',
    customer: 'Tariq Mehmood',
    phone: '0312-4040404',
    branch: 'Branch 1',
    items: [{ name: 'Karahi Gosht', qty: 1, price: 1800 }, { name: 'Naan', qty: 4, price: 200 }],
    totalAmount: 2000,
    status: 'Confirmed',
    orderType: 'Dine-in',
    paymentMethod: 'Cash',
    address: 'N/A',
    date: '2026-04-04',
    time: '07:55 AM',
  },
  {
    id: 'ISB-001494',
    customer: 'Rabia Khalid',
    phone: '0322-6060606',
    branch: 'Branch 2',
    items: [{ name: 'Creme Caramel', qty: 2, price: 480 }],
    totalAmount: 480,
    status: 'Pending',
    orderType: 'Pickup',
    paymentMethod: 'COD',
    address: 'N/A',
    date: '2026-04-03',
    time: '06:30 PM',
  },
];

// ── All possible order statuses ────────────────────────────────────────────────
// The dropdown on each row will show these options for the admin to pick from
const ALL_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];

// ── Filter tabs at the top ─────────────────────────────────────────────────────
const FILTER_TABS = ['All', ...ALL_STATUSES];

// ── Status badge colors ────────────────────────────────────────────────────────
// Maps each status string to Tailwind color classes for the badge pill
const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Confirmed: 'bg-blue-100   text-blue-700   border border-blue-200',
  Preparing: 'bg-orange-100 text-orange-700 border border-orange-200',
  Delivered: 'bg-green-100  text-green-700  border border-green-200',
  Cancelled: 'bg-red-100    text-red-600    border border-red-200',
};

// ── Payment method badge colors ────────────────────────────────────────────────
const PAYMENT_COLORS = {
  COD:    'bg-gray-100 text-gray-600',
  Cash:   'bg-gray-100 text-gray-600',
  Online: 'bg-purple-100 text-purple-700',
  Card:   'bg-indigo-100 text-indigo-700',
};

function ManageOrders() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [orders, setOrders]           = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab]     = useState('All');  // current filter tab
  const [viewOrder, setViewOrder]     = useState(null);   // order shown in detail modal

  // ── Derived: filtered orders based on active tab ───────────────────────────
  const filtered = activeTab === 'All'
    ? orders
    : orders.filter(o => o.status === activeTab);

  /**
   * Change the status of a specific order.
   * Called when admin selects a new status from the dropdown.
   * TODO: Also call PUT /api/orders/:id/status { status: newStatus }
   */
  const updateStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  // ── Count per tab (shows numbers on filter tabs) ───────────────────────────
  const countByStatus = (tab) => {
    if (tab === 'All') return orders.length;
    return orders.filter(o => o.status === tab).length;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ══════════════════════════════════════════════════════════════════════
          FILTER TABS — All / Pending / Confirmed / Preparing / Delivered / Cancelled
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1 flex-wrap bg-white border border-border rounded-xl p-1.5 w-fit shadow-sm">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5
              ${activeTab === tab
                ? 'text-white shadow-sm'
                : 'text-text-light hover:text-text-dark hover:bg-secondary'
              }
            `}
            style={activeTab === tab ? { backgroundColor: '#8B1A1A' } : {}}
          >
            {tab}
            {/* Count badge next to tab label */}
            <span className={`
              text-[10px] font-bold px-1.5 py-0.5 rounded-full
              ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-secondary text-text-light'}
            `}>
              {countByStatus(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ORDERS TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Order ID', 'Customer', 'Branch', 'Items', 'Total', 'Type', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-secondary/20 transition-colors">

                  {/* Order ID */}
                  <td className="px-4 py-3 font-bold text-primary text-xs whitespace-nowrap">
                    #{order.id}
                  </td>

                  {/* Customer name + phone */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-bold text-text-dark text-sm">{order.customer}</p>
                    <p className="text-xs text-text-light">{order.phone}</p>
                  </td>

                  {/* Branch */}
                  <td className="px-4 py-3 text-text-light text-xs whitespace-nowrap">
                    {order.branch}
                  </td>

                  {/* Number of items */}
                  <td className="px-4 py-3 text-text-light text-xs">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>

                  {/* Total amount */}
                  <td className="px-4 py-3 font-bold text-text-dark whitespace-nowrap">
                    Rs. {order.totalAmount.toLocaleString()}
                  </td>

                  {/* Order Type: Delivery / Pickup / Dine-in */}
                  <td className="px-4 py-3 text-text-light text-xs">
                    {order.orderType}
                  </td>

                  {/* Payment Method badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${PAYMENT_COLORS[order.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                      {order.paymentMethod}
                    </span>
                  </td>

                  {/* ── Status dropdown ──
                      Admin can change the order status directly from this dropdown.
                      TODO: On change → PUT /api/orders/:id/status
                  */}
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer
                        ${order.status === 'Delivered' ? 'border-green-200 bg-green-50 text-green-700' :
                          order.status === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-600' :
                          order.status === 'Pending'   ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                          order.status === 'Confirmed' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          'border-orange-200 bg-orange-50 text-orange-700'}
                      `}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Date + Time */}
                  <td className="px-4 py-3 text-text-light text-xs whitespace-nowrap">
                    <p>{order.date}</p>
                    <p>{order.time}</p>
                  </td>

                  {/* View Details button */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setViewOrder(order)}
                      className="p-1.5 rounded-lg text-text-light hover:bg-secondary hover:text-text-dark transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>

                </tr>
              ))}

              {/* Empty state: shown when no orders match the filter */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-14 text-text-light font-body">
                    No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ORDER DETAIL MODAL
          Shown when admin clicks the Eye icon on any order row.
          Displays full order info including items list and address.
      ══════════════════════════════════════════════════════════════════════ */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-xl text-text-dark">
                  Order #{viewOrder.id}
                </h3>
                <p className="text-xs text-text-light mt-0.5">
                  {viewOrder.date} at {viewOrder.time}
                </p>
              </div>
              {/* Status badge + Close */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[viewOrder.status]}`}>
                  {viewOrder.status}
                </span>
                <button
                  onClick={() => setViewOrder(null)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">

              {/* Customer info */}
              <div>
                <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-2">Customer Info</p>
                <div className="bg-secondary/40 rounded-lg p-4 space-y-1">
                  <p className="font-bold text-text-dark">{viewOrder.customer}</p>
                  <p className="text-sm text-text-light">{viewOrder.phone}</p>
                  <p className="text-sm text-text-light">{viewOrder.branch}</p>
                  {viewOrder.orderType === 'Delivery' && (
                    <p className="text-sm text-text-light">📍 {viewOrder.address}</p>
                  )}
                </div>
              </div>

              {/* Order details */}
              <div>
                <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-2">Order Details</p>
                <div className="space-y-1 mb-3">
                  <div className="flex gap-4 text-sm">
                    <span className="text-text-light">Type:</span>
                    <span className="font-semibold text-text-dark">{viewOrder.orderType}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-text-light">Payment:</span>
                    <span className="font-semibold text-text-dark">{viewOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div>
                <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-2">Items Ordered</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#F5F0EB' }}>
                        <th className="text-left px-4 py-2 text-xs font-bold text-text-light">Item</th>
                        <th className="text-center px-4 py-2 text-xs font-bold text-text-light">Qty</th>
                        <th className="text-right px-4 py-2 text-xs font-bold text-text-light">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {viewOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5 font-semibold text-text-dark">{item.name}</td>
                          <td className="px-4 py-2.5 text-center text-text-light">×{item.qty}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-text-dark">
                            Rs. {item.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border" style={{ backgroundColor: '#F5F0EB' }}>
                        <td colSpan={2} className="px-4 py-2.5 font-bold text-text-dark">Total</td>
                        <td className="px-4 py-2.5 text-right font-bold text-primary text-base">
                          Rs. {viewOrder.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Close button at bottom */}
              <button
                onClick={() => setViewOrder(null)}
                className="w-full py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageOrders;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/orders
 * Features:
 *   - Filter tabs: All / Pending / Confirmed / Preparing / Delivered / Cancelled
 *   - Orders table with status dropdown to update order status inline
 *   - Order detail modal (Eye icon) showing full item list and customer info
 *   - Count badge on each tab showing number of matching orders
 *
 * Schema fields used:
 *   customer, branch, totalAmount, status, orderType,
 *   paymentMethod, address, phone, items
 *
 * TODO: Connect to:
 *   GET /api/orders                 → load orders list
 *   PUT /api/orders/:id/status      → update order status
 */
