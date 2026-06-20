import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, MapPin, Phone } from 'lucide-react';
import api from '../../utils/api';

/**
 * ManageBranches Page
 * ====================
 * Shows both bakery branches as cards with full details.
 * Admin can edit each branch by clicking the Edit button.
 * Route: /admin/branches
 *
 * TODO: Connect to:
 *   GET /api/branches         → load branch list
 *   PUT /api/branches/:id     → update branch details
 */

// ── REAL BRANCH DATA ──────────────────────────────────────────────────────────
// This is real data provided by the business owner.
// TODO: Eventually load from GET /api/branches instead of hardcoding here.
const INITIAL_BRANCHES = [
  {
    id: 1,
    name: 'Dawood Chowk Branch',
    address: 'Dawood Chowk، Karbala Road, Madina Colony, Sahiwal, 57000',
    city: 'Sahiwal',
    phone: '0323 4404773',
    managerName: 'Ali Hassan',
    isActive: true,
  },
  {
    id: 2,
    name: 'Arra Tulla Road Branch',
    address: 'Arra Tulla Rd, Sahiwal',
    city: 'Sahiwal',
    phone: '0323 4404772',
    managerName: 'Kamran Baig',
    isActive: true,
  },
];

function ManageBranches() {
  const [branches, setBranches] = useState([]);

  // editId = which branch is currently being edited (null = none)
  const [editId, setEditId]   = useState(null);

  // form holds the current edit values
  const [form, setForm]       = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/branches');
      if (res.data.success) {
        setBranches(res.data.data.map(b => ({ ...b, id: b._id })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, []);

  // Open inline edit for a branch
  const openEdit = (branch) => {
    setEditId(branch.id);
    setForm({ ...branch }); // pre-fill form with current branch data
  };

  // Cancel edit — close form without saving
  const cancelEdit = () => {
    setEditId(null);
    setForm({});
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Save changes
  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/branches/${editId}`, form);
      fetchBranches();
      setEditId(null);
      setForm({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">

      {/* Info note for admin */}
      <p className="text-sm text-text-light">
        Managing <strong>{branches.length}</strong> branches. Click <strong>Edit</strong> on any card to update branch details.
      </p>

      {/* ── Branch Cards Grid (side by side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between"
              style={{ backgroundColor: '#F5F0EB' }}>
              <div>
                <h3 className="font-heading font-bold text-lg text-text-dark">{branch.name}</h3>
                <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  branch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {/* Edit button — opens inline form below */}
              {editId !== branch.id && (
                <button onClick={() => openEdit(branch)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit2 size={13} /> Edit
                </button>
              )}
            </div>

            {/* ── View Mode: Branch Details ── */}
            {editId !== branch.id && (
              <div className="px-6 py-5 space-y-3">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-text-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-sm text-text-dark">{branch.address}</p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-text-light shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-text-dark">{branch.phone}</p>
                  </div>
                </div>
                {/* City */}
                <div className="flex items-center gap-3">
                  <span className="text-text-light text-base shrink-0">🏙️</span>
                  <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-0.5">City</p>
                    <p className="text-sm text-text-dark">{branch.city}</p>
                  </div>
                </div>
                {/* Manager */}
                <div className="flex items-center gap-3">
                  <span className="text-text-light text-base shrink-0">👤</span>
                  <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-0.5">Manager</p>
                    <p className="text-sm font-semibold text-text-dark">{branch.managerName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Edit Mode: Inline Form ── */}
            {editId === branch.id && (
              <form onSubmit={saveEdit} className="px-6 py-5 space-y-4">

                {/* Branch Name */}
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>

                {/* City + Phone side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">City</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>

                {/* Manager Name */}
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Manager Name</label>
                  <input name="managerName" value={form.managerName} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* isActive checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-text-dark">Branch is Active</span>
                </label>

                {/* Save / Cancel buttons */}
                <div className="flex gap-3 pt-1">
                  <button type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#8B1A1A' }}>
                    <Check size={14} /> Save Changes
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">
                    <X size={14} /> Cancel
                  </button>
                </div>

              </form>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default ManageBranches;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/branches
 * Features:
 *   - Two branch cards shown side by side (one per branch)
 *   - View mode: shows address, phone, city, manager, active status
 *   - Edit mode: inline form replaces card content (no popup needed)
 *   - isActive toggle per branch
 *
 * Real branch data used:
 *   Branch 1: Dawood Chowk، Karbala Road, Madina Colony, Sahiwal | 0323 4404773
 *   Branch 2: Arra Tulla Rd, Sahiwal | 0323 4404772
 *
 * Schema fields used (Branch model):
 *   name, address, city, phone, managerName, isActive
 *
 * TODO: Connect to GET /api/branches and PUT /api/branches/:id using axios
 */
