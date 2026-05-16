import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

/**
 * ManageStaff Page
 * =================
 * View, add, edit, and delete staff members.
 * Route: /admin/staff
 *
 * TODO: Connect to:
 *   GET    /api/staff        → load all staff
 *   POST   /api/staff        → add new staff
 *   PUT    /api/staff/:id    → update staff
 *   DELETE /api/staff/:id    → delete staff
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with real API data from GET /api/staff
const INITIAL_STAFF = [
  { id: 1, name: 'Ali Hassan',    email: 'ali@ideal.com',    phone: '0300-1111111', role: 'manager',  branch: 'Branch 1', salary: 45000, joiningDate: '2023-01-15', address: 'Madina Colony, Sahiwal',   isActive: true  },
  { id: 2, name: 'Sara Ahmed',    email: 'sara@ideal.com',   phone: '0311-2222222', role: 'cashier',  branch: 'Branch 1', salary: 28000, joiningDate: '2023-03-10', address: 'Karbala Road, Sahiwal',    isActive: true  },
  { id: 3, name: 'Kamran Baig',   email: 'kamran@ideal.com', phone: '0321-3333333', role: 'chef',     branch: 'Branch 2', salary: 35000, joiningDate: '2023-06-01', address: 'Arra Tulla Road, Sahiwal', isActive: true  },
  { id: 4, name: 'Nadia Kausar',  email: 'nadia@ideal.com',  phone: '0333-4444444', role: 'waiter',   branch: 'Branch 2', salary: 22000, joiningDate: '2024-01-05', address: 'Model Town, Sahiwal',      isActive: true  },
  { id: 5, name: 'Imran Mirza',   email: 'imran@ideal.com',  phone: '0344-5555555', role: 'delivery', branch: 'Branch 1', salary: 25000, joiningDate: '2024-02-20', address: 'Qasim Abad, Sahiwal',      isActive: false },
  { id: 6, name: 'Zara Malik',    email: 'zara@ideal.com',   phone: '0355-6666666', role: 'cleaner',  branch: 'Branch 2', salary: 18000, joiningDate: '2024-05-11', address: 'Farid Town, Sahiwal',      isActive: true  },
];

// All possible roles — matches Staff schema enum
const ROLES = ['chef', 'cashier', 'manager', 'delivery', 'cleaner', 'waiter'];
const BRANCHES = ['Branch 1', 'Branch 2'];

// Empty form for Add new staff
const EMPTY_FORM = {
  name: '', email: '', phone: '', role: 'cashier',
  salary: '', branch: 'Branch 1', joiningDate: '', address: '', isActive: true,
};

// Role badge colors
const ROLE_COLORS = {
  manager:  'bg-purple-100 text-purple-700',
  chef:     'bg-orange-100 text-orange-700',
  cashier:  'bg-blue-100   text-blue-700',
  delivery: 'bg-teal-100   text-teal-700',
  waiter:   'bg-pink-100   text-pink-700',
  cleaner:  'bg-gray-100   text-gray-600',
};

function ManageStaff() {
  const [staff, setStaff]       = useState(INITIAL_STAFF);
  const [filterRole, setFilter] = useState('All');   // role filter dropdown
  const [showForm, setShowForm] = useState(false);   // show add/edit modal
  const [editId, setEditId]     = useState(null);    // null = add, number = edit
  const [form, setForm]         = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);    // confirm delete dialog

  // Filter staff by selected role
  const filtered = filterRole === 'All'
    ? staff
    : staff.filter(s => s.role === filterRole);

  // Open blank Add form
  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };

  // Open Edit form pre-filled
  const openEdit = (member) => { setForm({ ...member }); setEditId(member.id); setShowForm(true); };

  // Handle any input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Submit form — Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      // TODO: PUT /api/staff/:editId  with form data
      setStaff(prev => prev.map(s => s.id === editId ? { ...form, id: editId, salary: +form.salary } : s));
    } else {
      // TODO: POST /api/staff  with form data
      const newId = Math.max(...staff.map(s => s.id)) + 1;
      setStaff(prev => [...prev, { ...form, id: newId, salary: +form.salary }]);
    }
    setShowForm(false);
  };

  // Delete confirmed
  const confirmDelete = () => {
    // TODO: DELETE /api/staff/:deleteId
    setStaff(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">

      {/* ── Top Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Role filter */}
        <select
          value={filterRole}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="All">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>

        {/* Add Staff button */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* ── Staff Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Name', 'Role', 'Branch', 'Phone', 'Salary', 'Joining Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-secondary/20 transition-colors">
                  {/* Name + email */}
                  <td className="px-4 py-3">
                    <p className="font-bold text-text-dark">{member.name}</p>
                    <p className="text-xs text-text-light">{member.email}</p>
                  </td>
                  {/* Role badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-600'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-light text-xs">{member.branch}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{member.phone}</td>
                  <td className="px-4 py-3 font-semibold text-text-dark">Rs. {Number(member.salary).toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{member.joiningDate}</td>
                  {/* Active/Inactive */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(member.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-text-light">No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Staff Member' : 'Add New Staff'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">

              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Role *</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Salary (Rs.) *</label>
                <input name="salary" type="number" value={form.salary} onChange={handleChange} required min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Joining Date</label>
                <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Active toggle */}
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-text-dark">Active Employee</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> {editId !== null ? 'Save Changes' : 'Add Staff'}
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

      {/* ── Delete Confirm Dialog ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Remove Staff Member?</h3>
            <p className="text-text-light text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDelete} className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors">Yes, Remove</button>
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageStaff;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/staff
 * Features:
 *   - Staff table: Name, Role badge, Branch, Phone, Salary, Joining Date, Status
 *   - Role filter dropdown at top
 *   - Add/Edit modal with all schema fields
 *   - Delete confirm dialog
 *
 * Schema fields used:
 *   name, email, phone, role, salary, branch, joiningDate, address, isActive
 *
 * TODO: Connect CRUD to /api/staff endpoints using axios
 */
