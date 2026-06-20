import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import api from '../../utils/api';

/**
 * CounterSales (POS) Page
 * ========================
 * Point-of-sale page for in-store counter sales.
 * Left side: product search grid to pick items.
 * Right side: current order summary with quantities and total.
 *
 * Route: /admin/counter
 *
 * TODO: Connect to:
 *   GET  /api/products?isAvailable=true  → product list
 *   POST /api/counter-sales              → save the completed sale
 *   GET  /api/counter-sales?today=true   → today's sales summary
 */

// ── DUMMY PRODUCTS ────────────────────────────────────────────────────────────
// TODO: Replace with GET /api/products?isAvailable=true
const PRODUCTS = [
  { id: 1, name: 'Black Forest Cake', category: 'Bakery', price: 2200, image: '🎂' },
  { id: 2, name: 'Zinger Burger',     category: 'Fast Food', price: 450,  image: '🍔' },
  { id: 3, name: 'Gulab Jamun 1kg',   category: 'Desi',    price: 500,  image: '🍮' },
  { id: 4, name: 'Mango Milkshake',   category: 'Drinks',  price: 220,  image: '🥤' },
  { id: 5, name: 'Chocolate Brownie', category: 'Desserts',price: 320,  image: '🍫' },
  { id: 6, name: 'Chicken Shawarma',  category: 'Fast Food', price: 380,image: '🌯' },
  { id: 7, name: 'Pineapple Cake',    category: 'Bakery',  price: 1800, image: '🍰' },
  { id: 8, name: 'Samosa (6 pcs)',    category: 'Desi',    price: 180,  image: '🥟' },
  { id: 9, name: 'French Fries',      category: 'Fast Food', price: 200, image: '🍟' },
  { id: 10,name: 'Vanilla Ice Cream', category: 'Desserts',price: 180,  image: '🍦' },
  { id: 11,name: 'Green Tea',         category: 'Drinks',  price: 120,  image: '🍵' },
  { id: 12,name: 'Barfi 500g',        category: 'Desi',    price: 350,  image: '🍬' },
];

// ── DUMMY TODAY'S SALES SUMMARY ───────────────────────────────────────────────
// TODO: Replace with GET /api/counter-sales?today=true
const TODAYS_SUMMARY = {
  totalSales: 12,
  totalRevenue: 18450,
  cashSales: 8,
  cardSales: 2,
  onlineSales: 2,
};

// Payment methods — matches CounterSales schema enum
const PAYMENT_METHODS = ['Cash', 'Card', 'Online'];

function CounterSales() {
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

  const fetchInitialData = async () => {
    try {
      const [prodRes, summaryRes] = await Promise.all([
        api.get('/api/products?isAvailable=true'),
        api.get('/api/counter-sales?today=true')
      ]);
      
      if (prodRes.data.success) {
        setProducts(prodRes.data.data.map(p => ({
          ...p,
          id: p._id,
          image: p.image || '🍞'
        })));
      }
      
      if (summaryRes.data.success) {
        setTodaysSummary(summaryRes.data.data);
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
   * TODO: POST /api/counter-sales {
   *   branch, cashier, items: orderItems,
   *   totalAmount: total, paymentMethod
   * }
   */
  const completeSale = async () => {
    if (orderItems.length === 0) return;
    try {
      await api.post('/api/counter-sales', {
        items: orderItems.map(i => ({ product: i.id, qty: i.qty, price: i.price, name: i.name })),
        totalAmount: total,
        paymentMethod
      });
      setSaleComplete(true);
      setOrderItems([]);
      setSearch('');
      fetchInitialData(); // refresh summary
      // Hide success message after 3 seconds
      setTimeout(() => setSaleComplete(false), 3000);
    } catch (err) {
      console.error(err);
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
                  {/* Emoji icon */}
                  <div className="text-3xl mb-2">{product.image}</div>
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
      {/* TODO: Replace TODAYS_SUMMARY with real data from GET /api/counter-sales?today=true */}
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
 * TODO:
 *   - Load products from GET /api/products?isAvailable=true
 *   - On complete: POST /api/counter-sales { items, totalAmount, paymentMethod, branch }
 *   - Load today summary from GET /api/counter-sales?today=true
 */
