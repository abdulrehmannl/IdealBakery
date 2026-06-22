import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';

/**
 * Inventory Page
 * ===============
 * Track raw material / ingredient stock per branch.
 * Shows LOW STOCK badge when quantity falls below minStock.
 * Admin can add new items and edit existing ones.
 *
 * Route: /admin/inventory
 *
 * TODO: Connect to:
 *   GET    /api/inventory?branch=     → load inventory items
 *   POST   /api/inventory             → add new item
 *   PUT    /api/inventory/:id         → update item
 *   DELETE /api/inventory/:id         → delete item
 */



const BRANCHES = ['All', 'Branch 1', 'Branch 2'];
const UNITS    = ['kg', 'g', 'L', 'ml', 'dozen', 'pieces', 'packets'];

const EMPTY_FORM = {
  name: '', branch: 'Branch 1', unit: 'kg',
  quantity: '', minStock: '', costPerUnit: '',
};

const Inventory = () => {
  const [branchesList, setBranchesList] = useState([]);
  const [items, setItems]           = useState([]);
  const [branch, setBranch]         = useState('All');   // branch filter
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [deleteId, setDeleteId]     = useState(null);
  const [isLoading, setIsLoading]   = useState(true);

  const fetchInitialData = async () => {
    try {
      const [invRes, branchRes] = await Promise.all([
        api.get('/api/inventory'),
        api.get('/api/branches')
      ]);
      
      if (branchRes.data.success) {
        setBranchesList(branchRes.data.data);
      }
      
      if (invRes.data.success) {
        setItems(invRes.data.data.map(i => ({ ...i, id: i._id })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  // Filter items by selected branch
  const filtered = branch === 'All' ? (items || []) : (items || []).filter(i => (i.branch?.name || i.branch) === branch);

  // Count how many items are low stock in current view
  const lowStockCount = filtered.filter(i => i.quantity < i.minStock).length;

  const openAdd  = () => { 
    setForm({
      ...EMPTY_FORM,
      branch: branchesList.length > 0 ? branchesList[0]._id : ''
    }); 
    setEditId(null); 
    setShowForm(true); 
  };
  const openEdit = (item) => { 
    setForm({ 
      ...item,
      branch: item.branch?._id || item.branch
    }); 
    setEditId(item.id); 
    setShowForm(true); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = {
      ...form,
      quantity:    Number(form.quantity),
      minStock:    Number(form.minStock),
      costPerUnit: Number(form.costPerUnit),
    };
    try {
      if (editId !== null) {
        await api.put(`/api/inventory/${editId}`, parsed);
      } else {
        await api.post('/api/inventory', parsed);
      }
      fetchInitialData();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/inventory/${deleteId}`);
      fetchInitialData();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text-light">Loading...</div>;

  return (
    <div className="space-y-5">

      {/* ── Top Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Branch filter tabs */}
          <div className="flex gap-1 bg-white border border-border rounded-lg p-1 shadow-sm">
            {['All', ...(branchesList || []).map(b => b.name)].map((b, idx) => (
              <button
                key={`${b}-${idx}`}
                onClick={() => setBranch(b)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-150 ${
                  branch === b ? 'text-white' : 'text-text-light hover:text-text-dark'
                }`}
                style={branch === b ? { backgroundColor: '#8B1A1A' } : {}}
              >
                {b}
              </button>
            ))}
          </div>
          {/* Low stock warning badge */}
          {lowStockCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <AlertTriangle size={13} /> {lowStockCount} Low Stock
            </span>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* ── Inventory Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Item Name', 'Branch', 'Unit', 'Quantity', 'Min Stock', 'Cost/Unit', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(filtered || []).map(item => {
                // An item is "low stock" when current quantity < minimum required stock
                const isLow = item.quantity < item.minStock;
                return (
                  <tr key={item.id} className={`hover:bg-secondary/20 transition-colors ${isLow ? 'bg-red-50/50' : ''}`}>
                    <td className="px-4 py-3 font-bold text-text-dark">{item.name}</td>
                    <td className="px-4 py-3 text-text-light text-xs">{item.branch?.name || item.branch}</td>
                    <td className="px-4 py-3 text-text-light text-xs">{item.unit}</td>
                    {/* Quantity — shown in red if low */}
                    <td className="px-4 py-3">
                      <span className={`font-bold ${isLow ? 'text-red-600' : 'text-text-dark'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-light text-xs">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3 text-text-dark">Rs. {item.costPerUnit}/unit</td>
                    {/* LOW STOCK badge */}
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full w-fit">
                          <AlertTriangle size={11} /> LOW STOCK
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-text-light">No inventory items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Inventory Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {/* Item Name */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Item Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {(branchesList || []).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              {/* Unit */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Unit *</label>
                <select name="unit" value={form.unit} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Current Quantity *</label>
                <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Min Stock */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Min Stock Level *</label>
                <input name="minStock" type="number" value={form.minStock} onChange={handleChange} required min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Cost per unit */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Cost per Unit (Rs.)</label>
                <input name="costPerUnit" type="number" value={form.costPerUnit} onChange={handleChange} min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> {editId !== null ? 'Save Changes' : 'Add Item'}
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
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Item?</h3>
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

export default Inventory;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/inventory
 * Features:
 *   - Branch filter tabs (All / Branch 1 / Branch 2)
 *   - LOW STOCK badge (red) shown when quantity < minStock
 *   - Low stock count warning badge in top bar
 *   - Add/Edit modal with all schema fields
 *   - Delete confirm dialog
 *
 * Schema fields used (Inventory model):
 *   name, branch, unit, quantity, minStock, costPerUnit
 *
 * TODO: Connect CRUD to /api/inventory endpoints using axios
 */
