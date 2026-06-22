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
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/branches');
      if (res.data.success) {
        const branchesData = res.data.data || [];
        setBranches(branchesData.map(b => ({ ...b, id: b._id })));
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/api/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setForm(prev => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image.');
    }
  };

  // Save changes
  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      if (editId === 'new') {
        await api.post('/api/branches', form);
        setShowAddForm(false);
      } else {
        await api.put(`/api/branches/${editId}`, form);
      }
      fetchBranches();
      setEditId(null);
      setForm({});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save branch');
    }
  };

  const openAdd = () => {
    setEditId('new');
    setForm({ name: '', address: '', city: 'Sahiwal', phone: '', managerName: '', image: '', googleMapsLink: '', isActive: true });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-5">

      {/* Info note and Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-light">
          Managing <strong>{branches.length}</strong> branches. Click <strong>Edit</strong> on any card to update branch details.
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm bg-primary"
        >
          + Add Branch
        </button>
      </div>

      {/* ── Branch Cards Grid (side by side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between"
              style={{ backgroundColor: '#F5F0EB' }}>
              <div>
                <h3 className="font-heading font-bold text-lg text-text-dark">{branch.name}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    branch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {branch.image && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 rounded-full font-bold">Has Image</span>
                  )}
                  {branch.googleMapsLink && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 rounded-full font-bold">Has Map Link</span>
                  )}
                </div>
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
                  <input name="managerName" value={form.managerName || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Google Maps Link */}
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Google Maps Link</label>
                  <input name="googleMapsLink" value={form.googleMapsLink || ''} onChange={handleChange} placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Branch Image */}
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch Image</label>
                  <div className="flex items-center gap-3">
                    <input name="image" value={form.image || ''} onChange={handleChange} placeholder="Image URL (or upload below)"
                      className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <label className="cursor-pointer bg-secondary text-text-dark px-3 py-2.5 rounded-lg text-sm font-bold border border-border hover:bg-border transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {form.image && <img src={form.image} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg border border-border" />}
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
        {/* ── Add Mode: Inline Form ── */}
        {editId === 'new' && showAddForm && (
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between"
              style={{ backgroundColor: '#F5F0EB' }}>
              <h3 className="font-heading font-bold text-lg text-text-dark">New Branch</h3>
            </div>
            <form onSubmit={saveEdit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">City</label>
                  <input name="city" value={form.city} onChange={handleChange} required
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Manager Name</label>
                <input name="managerName" value={form.managerName || ''} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Google Maps Link</label>
                <input name="googleMapsLink" value={form.googleMapsLink || ''} onChange={handleChange} placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch Image</label>
                <div className="flex items-center gap-3">
                  <input name="image" value={form.image || ''} onChange={handleChange} placeholder="Image URL (or upload below)"
                    className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <label className="cursor-pointer bg-secondary text-text-dark px-3 py-2.5 rounded-lg text-sm font-bold border border-border hover:bg-border transition-colors">
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg border border-border" />}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-semibold text-text-dark">Branch is Active</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={14} /> Create Branch
                </button>
                <button type="button" onClick={() => { setEditId(null); setShowAddForm(false); }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}
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
