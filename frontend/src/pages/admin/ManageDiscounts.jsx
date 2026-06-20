import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';

/**
 * ManageDiscounts Page
 * =====================
 * View, add, edit, and delete product discounts.
 * Supports two types: Percentage or Flat amount.
 * Route: /admin/discounts
 *
 * TODO: Connect to:
 *   GET    /api/discounts         → load all discounts
 *   POST   /api/discounts         → add new discount
 *   PUT    /api/discounts/:id     → update discount
 *   DELETE /api/discounts/:id     → delete discount
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with GET /api/discounts
// Fields match Discount mongoose schema:
//   title, description, discountType, value, product, startDate, endDate, isActive
const INITIAL_DISCOUNTS = [
  { id: 1, title: 'Eid Special',       description: 'Eid discount on all cakes',    discountType: 'percentage', value: 15, product: 'All Cakes',        startDate: '2026-04-05', endDate: '2026-04-10', isActive: true  },
  { id: 2, title: 'Friday Deal',       description: 'Flat off on burgers Fridays',  discountType: 'flat',       value: 50, product: 'Zinger Burger',    startDate: '2026-04-04', endDate: '2026-04-30', isActive: true  },
  { id: 3, title: 'Summer Shake Off',  description: '20% off milkshakes in summer', discountType: 'percentage', value: 20, product: 'Mango Milkshake',  startDate: '2026-05-01', endDate: '2026-08-31', isActive: false },
  { id: 4, title: 'New Year Offer',    description: 'Flat Rs.100 off on any cake',  discountType: 'flat',       value: 100,product: 'Black Forest Cake', startDate: '2025-12-31', endDate: '2026-01-03', isActive: false },
];

const EMPTY_FORM = {
  title: '', description: '', discountType: 'percentage',
  value: '', product: '', startDate: '', endDate: '', isActive: true,
};

function ManageDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [activeTab, setActiveTab] = useState('Active');   // 'Active' or 'Expired'
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [deleteId, setDeleteId]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      const res = await api.get('/api/discounts');
      if (res.data.success) {
        setDiscounts(res.data.data.map(d => ({
          ...d,
          id: d._id,
          product: d.product || 'All Products',
          startDate: new Date(d.startDate).toISOString().split('T')[0],
          endDate: new Date(d.endDate).toISOString().split('T')[0]
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  // Filter by Active / Expired (which is just isActive toggle)
  const filtered = discounts.filter(d =>
    activeTab === 'Active' ? d.isActive : !d.isActive
  );

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (d) => { setForm({ ...d }); setEditId(d.id); setShowForm(true); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = { ...form, value: Number(form.value) };
    try {
      if (editId !== null) {
        await api.put(`/api/discounts/${editId}`, parsed);
      } else {
        await api.post('/api/discounts', parsed);
      }
      fetchDiscounts();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle isActive directly from table row
  const toggleActive = async (id) => {
    const discount = discounts.find(d => d.id === id);
    if (!discount) return;
    try {
      await api.put(`/api/discounts/${id}`, { isActive: !discount.isActive });
      setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/discounts/${deleteId}`);
      fetchDiscounts();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Top Controls ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Active / Expired filter tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-lg p-1 shadow-sm">
          {['Active', 'Expired'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-150 ${activeTab === tab ? 'text-white' : 'text-text-light hover:text-text-dark'}`}
              style={activeTab === tab ? { backgroundColor: '#8B1A1A' } : {}}>
              {tab}
            </button>
          ))}
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}>
          <Plus size={16} /> Add Discount
        </button>
      </div>

      {/* ── Discounts Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Title', 'Type', 'Value', 'Product', 'Start Date', 'End Date', 'Active', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-text-dark">{d.title}</p>
                    <p className="text-xs text-text-light">{d.description}</p>
                  </td>
                  {/* Discount type badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      d.discountType === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {d.discountType}
                    </span>
                  </td>
                  {/* Discount value */}
                  <td className="px-4 py-3 font-bold" style={{ color: '#8B1A1A' }}>
                    {d.discountType === 'percentage' ? `${d.value}%` : `Rs. ${d.value}`}
                  </td>
                  <td className="px-4 py-3 text-text-light text-xs">{d.product}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{d.startDate}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{d.endDate}</td>
                  {/* isActive toggle switch */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${d.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${d.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(d.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-text-light">No {activeTab.toLowerCase()} discounts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Discount' : 'Add New Discount'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Description */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Description</label>
                <input name="description" value={form.description} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Discount Type toggle */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-2 uppercase tracking-wide">Discount Type *</label>
                <div className="flex gap-2">
                  {['percentage', 'flat'].map(type => (
                    <button key={type} type="button"
                      onClick={() => setForm(prev => ({ ...prev, discountType: type }))}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg border transition-all duration-150 capitalize ${
                        form.discountType === type ? 'text-white border-transparent' : 'text-text-light border-border hover:bg-secondary'
                      }`}
                      style={form.discountType === type ? { backgroundColor: '#8B1A1A' } : {}}>
                      {type === 'percentage' ? '% Percentage' : 'Rs. Flat Amount'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Value */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">
                  {form.discountType === 'percentage' ? 'Percentage (%)' : 'Flat Amount (Rs.)'} *
                </label>
                <input name="value" type="number" value={form.value} onChange={handleChange} required min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Product */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Product / Category</label>
                <input name="product" value={form.product} onChange={handleChange} placeholder="e.g. All Cakes"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* End Date */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">End Date</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* isActive toggle */}
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-text-dark">Active (visible to customers)</span>
                </label>
              </div>
              {/* Buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> {editId !== null ? 'Save Changes' : 'Add Discount'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Discount?</h3>
            <p className="text-text-light text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDelete} className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors">Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageDiscounts;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/discounts
 * Features:
 *   - Active / Expired filter tabs
 *   - Discounts table with type badge, value, dates
 *   - isActive toggle switch per row
 *   - Add/Edit modal with Percentage vs Flat type selector
 *   - Delete confirm dialog
 *
 * Schema fields used (Discount model):
 *   title, description, discountType, value, product,
 *   startDate, endDate, isActive
 *
 * TODO: Connect CRUD to /api/discounts endpoints using axios
 */
