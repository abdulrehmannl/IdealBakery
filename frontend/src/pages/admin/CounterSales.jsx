import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

/**
 * CounterSales (POS) Page
 * ========================
 * Point-of-sale page for in-store counter sales.
 * Left side: product search grid to pick items.
 * Right side: current order summary with quantities and total.
 *
 * Route: /admin/counter
 */



// Payment methods — matches CounterSales schema enum
const PAYMENT_METHODS = ['Cash', 'Card', 'Online'];

function CounterSales() {
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [search, setSearch]             = useState('');       // product search text
  const [orderItems, setOrderItems]     = useState([]);       // items added to current order
  const [paymentMethod, setPayment]     = useState('Cash');   // selected payment method
  const [saleComplete, setSaleComplete] = useState(false);    // shows success message after sale
  const [products, setProducts]         = useState([]);
  const [todaysSummary, setTodaysSummary] = useState({
    totalSales: 0,
    totalRevenue: 0,
    cashSales: 0,
    cardSales: 0,
    onlineSales: 0,
  });
  const [branches, setBranches] = useState([]);

  const fetchInitialData = async () => {
    try {
      const [prodRes, summaryRes, branchRes] = await Promise.all([
        api.get('/api/products?isAvailable=true'),
        api.get('/api/counter?today=true'),
        api.get('/api/branches')
      ]);
      
      if (prodRes.data.success) {
        setProducts(prodRes.data.data.map(p => ({
          ...p,
          id: p._id,
          image: p.image
        })));
      }
      
      if (summaryRes.data.success) {
        const salesData = summaryRes.data.data || [];
        // Calculate the summary from the sales array
        const cashSales = salesData.filter(s => s.paymentMethod?.toLowerCase() === 'cash').length;
        const cardSales = salesData.filter(s => s.paymentMethod?.toLowerCase() === 'card').length;
        const onlineSales = salesData.filter(s => s.paymentMethod?.toLowerCase() === 'online').length;
        
        setTodaysSummary({
          totalSales: salesData.length,
          totalRevenue: summaryRes.data.totalRevenue || 0,
          cashSales,
          cardSales,
          onlineSales
        });
      }
      if (branchRes.data.success) {
        setBranches(branchRes.data.data || branchRes.data.branches);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  // Filter products by search text
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.name && p.category.name.toLowerCase().includes(search.toLowerCase())) ||
    (typeof p.category === 'string' && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  /**
   * Add a product to the current order.
   * If already in order, just increase quantity by 1.
   */
  const addToOrder = (product) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        // Product already in order — increase qty
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      // Add as new item with qty 1
      return [...prev, { ...product, qty: 1 }];
    });
  };

  /**
   * Increase or decrease item quantity.
   * If qty goes to 0, remove item from order.
   */
  const changeQty = (id, delta) => {
    setOrderItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0) // remove if qty = 0
    );
  };

  // Remove an item completely from order
  const removeItem = (id) => {
    setOrderItems(prev => prev.filter(i => i.id !== id));
  };

  // Total amount of current order
  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Count of total items in order
  const totalQty = orderItems.reduce((sum, i) => sum + i.qty, 0);

  /**
   * Complete the sale.
   * Saves the sale and clears the order form.
   */
  const completeSale = async () => {
    if (orderItems.length === 0) return;
    try {
      const saleBranch = user?.branch?._id || user?.branch || (branches.length > 0 ? branches[0]._id : null);
      if (!saleBranch) {
        alert("No branch available for this sale.");
        return;
      }
      
      await api.post('/api/counter', {
        branch: saleBranch,
        staff: user?._id || user?.id,
        items: orderItems.map(i => ({ product: i.id, quantity: i.qty, price: i.price, name: i.name })),
        totalAmount: total,
        paymentMethod: paymentMethod.toLowerCase()
      });
      setSaleComplete(true);
      setOrderItems([]);
      setSearch('');
      fetchInitialData(); // refresh summary
      // Hide success message after 3 seconds
      setTimeout(() => setSaleComplete(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to complete sale. Check console.");
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Success Message ── */}
      {saleComplete && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
          ✅ Sale completed successfully! Order saved.
        </div>
      )}

      {/* ── POS Layout: Left (products) + Right (order) ── */}
      <div className="flex gap-5" style={{ minHeight: '70vh' }}>

        {/* ════════════════════════════════════════════
            LEFT SIDE: Product Search + Grid
        ════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Product grid — click any card to add it to the order */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto" style={{ maxHeight: '65vh' }}>
            {filteredProducts.map(product => {
              // Check if this product is already in the current order
              const inOrder = orderItems.find(i => i.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addToOrder(product)}
                  className={`
                    bg-white border rounded-xl p-4 text-left hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 group
                    ${inOrder ? 'border-primary/40 bg-primary/5' : 'border-border'}
                  `}
                >
                  {/* Product Image */}
                  <div className="w-[calc(100%+2rem)] h-32 bg-secondary/30 rounded-t-xl overflow-hidden flex items-center justify-center relative -mt-4 -ml-4 mb-3">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                    <span className="text-4xl text-gray-400 absolute z-0 opacity-40">🍞</span>
                  </div>
                  {/* Product name */}
                  <p className="font-bold text-text-dark text-sm leading-tight">{product.name}</p>
                  {/* Category */}
                  <p className="text-xs text-text-light mt-0.5">{product.category?.name || product.category}</p>
                  {/* Price */}
                  <p className="font-bold mt-2 text-sm" style={{ color: '#8B1A1A' }}>
                    Rs. {product.price.toLocaleString()}
                  </p>
                  {/* Show qty if already added */}
                  {inOrder && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#8B1A1A' }}>
                      {inOrder.qty} in order
                    </span>
                  )}
                </button>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-16 text-text-light">No products found.</div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT SIDE: Current Order Summary
        ════════════════════════════════════════════ */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border shadow-sm flex flex-col">

          {/* Order header */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} style={{ color: '#8B1A1A' }} />
              <h3 className="font-heading font-bold text-base text-text-dark">
                Current Order
              </h3>
              {totalQty > 0 && (
                <span className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#8B1A1A' }}>
                  {totalQty} items
                </span>
              )}
            </div>
          </div>

          {/* Order items list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {orderItems.length === 0 ? (
              <div className="text-center py-10 text-text-light text-sm">
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                <p>Click a product to add it</p>
              </div>
            ) : (
              orderItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                  {/* Item name + subtotal */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-dark text-xs truncate">{item.name}</p>
                    <p className="text-xs text-text-light">Rs. {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                  {/* Qty controls: − qty + */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold text-text-dark w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, +1)}
                      className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors ml-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order total + payment + complete button */}
          <div className="px-5 py-4 border-t border-border space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-dark">Total</span>
              <span className="font-heading font-bold text-xl" style={{ color: '#8B1A1A' }}>
                Rs. {total.toLocaleString()}
              </span>
            </div>

            {/* Payment method selector */}
            <div>
              <label className="block text-xs font-bold text-text-light mb-1.5 uppercase tracking-wide">Payment Method</label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method}
                    onClick={() => setPayment(method)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all duration-150 ${
                      paymentMethod === method ? 'text-white border-transparent' : 'text-text-light border-border hover:bg-secondary'
                    }`}
                    style={paymentMethod === method ? { backgroundColor: '#8B1A1A' } : {}}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Sale button */}
            <button
              onClick={completeSale}
              disabled={orderItems.length === 0}
              className="w-full py-3 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#8B1A1A' }}
            >
              ✓ Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* ── Today's Sales Summary ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        <h3 className="font-heading font-bold text-base text-text-dark mb-4">Today's Sales Summary</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Total Sales',  value: todaysSummary.totalSales,   color: '#8B1A1A' },
            { label: 'Revenue',      value: `Rs. ${todaysSummary.totalRevenue.toLocaleString()}`, color: '#16a34a' },
            { label: 'Cash Sales',   value: todaysSummary.cashSales,    color: '#1d4ed8' },
            { label: 'Card Sales',   value: todaysSummary.cardSales,    color: '#7c3aed' },
            { label: 'Online Sales', value: todaysSummary.onlineSales,  color: '#0891b2' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="font-heading font-bold text-xl" style={{ color }}>{value}</p>
              <p className="text-xs text-text-light mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CounterSales;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/counter
 * Features:
 *   - POS split layout: products on left, order summary on right
 *   - Product search + click-to-add product grid
 *   - Order items with +/- quantity controls and remove button
 *   - Auto-calculated total
 *   - Payment method toggle: Cash / Card / Online
 *   - "Complete Sale" button (clears order + shows success message)
 *   - Today's sales summary section at bottom
 *
 * Schema fields used (CounterSales model):
 *   branch, cashier, items (name, qty, price), totalAmount, paymentMethod
 *
 * Dynamic Data:
 *   - Load products from GET /api/products?isAvailable=true
 *   - On complete: POST /api/counter { items, totalAmount, paymentMethod, branch }
 *   - Load today summary from GET /api/counter?today=true
 */
