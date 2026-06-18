import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Edit2, Trash2, X, Check, Search, RefreshCw,
    UserCheck, UserX, Eye, EyeOff, Users, ShieldCheck, UserCog
} from 'lucide-react';
import api from '../../utils/api';

/**
 * ManageUsers Page
 * =================
 * Admin-only page at /admin/users
 * Full CRUD for Customer accounts.
 *
 * Features:
 *   - Live table of all customers (fetched from GET /api/users)
 *   - Create user modal (name, phone, password)
 *   - Edit user modal (all fields + password reset)
 *   - Activate / Deactivate toggle (soft delete via PATCH /api/users/:id/toggle-status)
 *   - Hard delete with confirm dialog (DELETE /api/users/:id)
 *   - Search by name/phone
 */

// ── Constants ──────────────────────────────────────────────────────────────


const AUTH_PROVIDER_LABELS = {
    internal: 'Internal',
    phone:    'Phone OTP',
    google:   'Google',
};

const EMPTY_FORM = {
    name:     '',
    phone:    '',
    password: '',
    confirmPassword: '',
    role:     'staff',
    branch:   '',
    jobTitle: '',
};

// ── Sub-components ─────────────────────────────────────────────────────────

/** Reusable labelled input field */
function Field({ label, required, children }) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#666' }}>
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

const INPUT = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 bg-white";

// ── Main Component ──────────────────────────────────────────────────────────
function ManageUsers() {
    // ── State ──
    const [users,    setUsers]    = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    // Filters
    const [filterStatus, setFilterStatus] = useState('All');
    const [search,       setSearch]       = useState('');

    // Modal
    const [showForm,    setShowForm]    = useState(false);
    const [editId,      setEditId]      = useState(null);   // null = create mode
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [showPass,    setShowPass]    = useState(false);
    const [submitting,  setSubmitting]  = useState(false);
    const [formError,   setFormError]   = useState('');

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting,     setDeleting]     = useState(false);

    // Toggle status loading id
    const [toggling, setToggling] = useState(null);

    // ── Data fetching ──
    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const [usersRes, branchesRes] = await Promise.all([
                api.get('/api/users'),
                api.get('/api/branches')
            ]);
            setUsers(usersRes.data.users || []);
            setBranches(branchesRes.data.data || branchesRes.data.branches || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // ── Filtering ──
    const filteredUsers = users.filter(u => {
        if (filterStatus !== 'All') {
            if (filterStatus === 'Active'   && !u.isActive) return false;
            if (filterStatus === 'Inactive' &&  u.isActive) return false;
        }
        if (search) {
            const q = search.toLowerCase();
            return (
                u.name?.toLowerCase().includes(q) ||
                u.phone?.includes(q)
            );
        }
        return true;
    });

    // ── Modal helpers ──
    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setFormError('');
        setShowPass(false);
        setShowForm(true);
    };

    const openEdit = (user) => {
        setForm({
            name:     user.name     || '',
            phone:    user.phone    || '',
            password: '',                   // blank = don't change password
            confirmPassword: '',
            role:     user.role     || 'staff',
            branch:   user.branch?._id || user.branch || '',
            jobTitle: user.jobTitle || '',
        });
        setEditId(user._id);
        setFormError('');
        setShowPass(false);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ── Submit (create or update) ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Client-side validation
        if (!form.name.trim() || !form.phone.trim() || !form.role || !form.branch) {
            setFormError('Name, phone, role, and branch are required.');
            return;
        }
        if (!editId) {
            if (!form.password.trim()) {
                setFormError('Password is required when creating a new user.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                setFormError('Passwords do not match.');
                return;
            }
        } else if (form.password.trim() && form.password !== form.confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                name:     form.name.trim(),
                phone:    form.phone.trim(),
                role:     form.role,
                branch:   form.branch,
                jobTitle: form.jobTitle?.trim() || undefined,
            };

            // Only include password if explicitly typed
            if (form.password.trim()) {
                payload.password = form.password;
            }

            if (editId) {
                await api.put(`/api/users/${editId}`, payload);
            } else {
                await api.post('/api/users/create-staff', payload);
            }

            setShowForm(false);
            fetchInitialData();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Toggle active/inactive ──
    const handleToggle = async (user) => {
        try {
            setToggling(user._id);
            await api.patch(`/api/users/${user._id}/toggle-status`);
            setUsers(prev =>
                prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u)
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setToggling(null);
        }
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await api.delete(`/api/users/${deleteTarget.id}`);
            setUsers(prev => prev.filter(u => u._id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeleting(false);
        }
    };

    // ── Summary stats ──
    const totalCustomers = users.length;
    const totalActive = users.filter(u => u.isActive).length;

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Customers',value: totalCustomers, Icon: Users,     color: '#1D6A3E' },
                    { label: 'Active Accounts',value: totalActive,    Icon: UserCheck, color: '#1D6A3E' },
                ].map(({ label, value, Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{value}</p>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Controls Row ── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, phone, title…"
                        className="pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 w-52"
                    />
                </div>


                {/* Status filter */}
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 bg-white"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                {/* Refresh */}
                <button
                    onClick={fetchInitialData}
                    className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={14} />
                </button>

                {/* Add User — pushed to right */}
                <button
                    onClick={openCreate}
                    className="ml-auto flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    style={{ backgroundColor: '#8B1A1A' }}
                >
                    <Plus size={16} /> Add User
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                    {error}
                </div>
            )}

            {/* ── Users Table ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100" style={{ backgroundColor: '#F5F0EB' }}>
                                {['Name & Contact', 'Role & Title', 'Branch', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-bold text-gray-500 text-xs tracking-wide uppercase whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
                                            <span className="text-gray-400 text-xs">Loading users…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-16">
                                        <UserCog size={36} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-400 font-semibold">No users found.</p>
                                        <p className="text-gray-300 text-xs mt-1">Try adjusting your filters or add a new user.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => {
                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* Name + phone */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                                        style={{ backgroundColor: '#6B21A8' }}>
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{user.name}</p>
                                                        <p className="text-xs text-gray-400">{user.phone || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role & Title */}
                                            <td className="px-4 py-3">
                                                <div>
                                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 uppercase tracking-wide border border-blue-100">
                                                        {user.role}
                                                    </span>
                                                    {user.jobTitle && <p className="text-xs text-gray-400 mt-1">{user.jobTitle}</p>}
                                                </div>
                                            </td>

                                            {/* Branch */}
                                            <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                                                {user.branch?.name || user.branch || '—'}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEdit(user)}
                                                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                                        title="Edit user"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>

                                                    {/* Toggle active */}
                                                    <button
                                                        onClick={() => handleToggle(user)}
                                                        disabled={toggling === user._id}
                                                        className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                                        title={user.isActive ? 'Deactivate account' : 'Activate account'}
                                                    >
                                                        {toggling === user._id
                                                            ? <RefreshCw size={14} className="animate-spin" />
                                                            : user.isActive ? <UserX size={14} /> : <UserCheck size={14} />
                                                        }
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: user._id, name: user.name })}
                                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                        Showing {filteredUsers.length} of {users.length} customer accounts
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                ADD / EDIT MODAL
            ══════════════════════════════════════════════════════════════ */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">
                                    {editId ? 'Edit User Account' : 'Create New Account'}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {editId
                                        ? 'Update account details. Leave password blank to keep current.'
                                        : 'Customer accounts created manually will use phone + password.'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div className="col-span-2">
                                <Field label="Full Name" required>
                                    <input name="name" value={form.name} onChange={handleChange} required
                                        className={INPUT} placeholder="e.g. Ali Hassan" />
                                </Field>
                            </div>

                            {/* Phone */}
                            <Field label="Phone Number" required>
                                <input name="phone" value={form.phone} onChange={handleChange} required
                                    className={INPUT} placeholder="03XXXXXXXXX" />
                            </Field>

                            {/* Role */}
                            <Field label="Role" required>
                                <select name="role" value={form.role} onChange={handleChange} required className={INPUT}>
                                    <option value="staff">Staff</option>
                                    <option value="manager">Manager</option>
                                    <option value="delivery">Delivery Rider</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </Field>

                            {/* Branch */}
                            <Field label="Branch" required>
                                <select name="branch" value={form.branch} onChange={handleChange} required className={INPUT}>
                                    <option value="">Select Branch</option>
                                    {branches.map(b => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                            </Field>

                            {/* Job Title */}
                            <Field label="Job Title">
                                <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                                    className={INPUT} placeholder="e.g. Cashier" />
                            </Field>


                            {/* Password */}
                            <div className="col-span-2">
                                <Field label={editId ? 'Reset Password (leave blank to keep current)' : 'Password'} required={!editId}>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPass ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={handleChange}
                                            required={!editId}
                                            className={INPUT + ' pr-10'}
                                            placeholder={editId ? 'Leave blank to keep current password' : 'Set a strong password'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </Field>
                            </div>

                            {/* Confirm Password */}
                            <div className="col-span-2">
                                <Field label={editId ? 'Confirm Reset Password' : 'Confirm Password'} required={!editId || form.password.length > 0}>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            type={showPass ? 'text' : 'password'}
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            required={!editId || form.password.length > 0}
                                            className={INPUT + ' pr-10'}
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                </Field>
                            </div>



                            {/* Form error */}
                            {formError && (
                                <div className="col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {formError}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                                    style={{ backgroundColor: '#8B1A1A' }}
                                >
                                    {submitting
                                        ? <RefreshCw size={14} className="animate-spin" />
                                        : <Check size={15} />
                                    }
                                    {editId ? 'Save Changes' : 'Create Account'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2.5 border border-gray-200 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                DELETE CONFIRM DIALOG
            ══════════════════════════════════════════════════════════════ */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-800 mb-1">Delete Account?</h3>
                        <p className="text-gray-500 text-sm mb-1">
                            You are about to permanently delete:
                        </p>
                        <p className="font-bold text-gray-800 mb-4">"{deleteTarget.name}"</p>
                        <p className="text-xs text-gray-400 mb-6">
                            This cannot be undone. Use "Deactivate" instead if you want to preserve the record.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                            >
                                {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-6 py-2.5 border border-gray-200 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageUsers;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/users   (admin only)
 * API:      /api/users (GET, POST, PUT, PATCH toggle-status, DELETE)
 *
 * Features:
 *   Summary cards: total staff, total admins, active accounts
 *   Table: name+phone, role badge, jobTitle, branch, authProvider, status, actions
 *   Create modal: name, phone, password (with show/hide), role, jobTitle, branch, address
 *   Edit modal: same fields; blank password = no change
 *   Toggle: activate/deactivate with spinner feedback
 *   Delete: confirm dialog with hard-delete warning
 *   Filters: role dropdown, status dropdown, live search
 *
 * Auth method labels:
 *   internal → "Internal"  (admin-created, phone+password, no OTP)
 *   phone    → "Phone OTP" (customer self-registered via OTP)
 *   google   → "Google"    (Google Sign-In)
 */
