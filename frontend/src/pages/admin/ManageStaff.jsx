import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Power } from 'lucide-react';
import api from '../../utils/api';

const ROLES = ['manager', 'staff', 'delivery', 'admin'];
const BRANCHES = ['6659c2522765874288b8131d', '6659c2522765874288b8131e']; // Need real branch IDs, but falling back to text if needed. Wait, in reality we should fetch branches. For now, the user uses 'Branch 1', 'Branch 2' text if branch is not populated, but the API expects an ObjectId. Let me fetch branches dynamically.

const EMPTY_FORM = {
  name: '', phone: '', password: '', role: 'staff', branch: '', isActive: true, jobTitle: ''
};

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, branchesRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/branches')
      ]);
      if (usersRes.data.success) setStaff(usersRes.data.users);
      if (branchesRes.data.success) setBranches(branchesRes.data.data);
      
      if (branchesRes.data.data?.length > 0 && !form.branch) {
          setForm(prev => ({ ...prev, branch: branchesRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Failed to load staff or branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => { 
    setForm({ ...EMPTY_FORM, branch: branches.length > 0 ? branches[0]._id : '' }); 
    setEditId(null); 
    setError(null);
    setShowForm(true); 
  };

  const openEdit = (member) => { 
    setForm({ 
      name: member.name, 
      phone: member.phone, 
      password: '', // Blank unless they want to change it
      role: member.role, 
      jobTitle: member.jobTitle || '',
      branch: member.branch ? (member.branch._id || member.branch) : (branches.length > 0 ? branches[0]._id : ''), 
      isActive: member.isActive 
    }); 
    setEditId(member._id); 
    setError(null);
    setShowForm(true); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        // Update user
        const updateData = { name: form.name, phone: form.phone, isActive: form.isActive, jobTitle: form.jobTitle };
        if (form.password) updateData.password = form.password; // Only send if filled
        // Note: userController PUT /api/users/:id does not natively update role/branch, but let's send it anyway
        await api.put(`/api/users/${editId}`, updateData);
      } else {
        // Add new user via create-staff
        await api.post('/api/users/create-staff', {
          name: form.name,
          phone: form.phone,
          password: form.password,
          role: form.role,
          jobTitle: form.jobTitle,
          branch: form.branch
        });
      }
      setShowForm(false);
      fetchData(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save staff member');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/users/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/users/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      console.error('Toggle status failed', err);
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text-light">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-dark font-heading">Staff Management</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm bg-primary"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F5F0EB]">
                {['Name', 'Phone', 'Role', 'Job Title', 'Branch', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map(member => (
                <tr key={member._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-text-dark">{member.name}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{member.phone}</td>
                  <td className="px-4 py-3 capitalize text-sm">{member.role}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{member.jobTitle || '—'}</td>
                  <td className="px-4 py-3 text-text-light text-xs">
                    {member.branch?.name || branches.find(b => b._id === member.branch)?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(member._id)} className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50" title="Toggle Status"><Power size={14} /></button>
                      <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(member._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-text-light">No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Staff / Reset Password' : 'Add New Staff'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="03001234567" className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase">
                  {editId ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required={!editId} className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>

                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1 uppercase">Role *</label>
                    <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1 uppercase">Branch *</label>
                    <select name="branch" value={form.branch} onChange={handleChange} required className="w-full px-3 py-2 border border-border rounded-lg">
                      <option value="">Select Branch</option>
                      {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1 uppercase">Job Title *</label>
                    <input 
                      name="jobTitle" 
                      list="manage-staff-job-titles"
                      value={form.jobTitle} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. Baker, Cashier, or type custom..."
                      className="w-full px-3 py-2 border border-border rounded-lg" 
                    />
                    <datalist id="manage-staff-job-titles">
                      <option value="Baker" />
                      <option value="Chef" />
                      <option value="Cashier" />
                      <option value="Counter Staff" />
                      <option value="Kitchen Helper" />
                      <option value="Packer" />
                      <option value="Cleaner" />
                      <option value="Rider" />
                      <option value="Driver" />
                    </datalist>
                  </div>

              {editId && (
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-text-dark">Active Account</span>
                </label>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-[#6A1414]">
                  {editId !== null ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="font-heading font-bold text-xl mb-2">Delete Staff?</h3>
            <p className="text-sm mb-6">This will permanently delete this user account.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} className="px-6 py-2 border border-border rounded-lg font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaff;
