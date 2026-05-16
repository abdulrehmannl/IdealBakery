import React, { useState } from 'react';
import { Plus, Trash2, X, Check } from 'lucide-react';

/**
 * Expenses Page
 * ==============
 * Track business expenses per branch and month.
 * Route: /admin/expenses
 *
 * TODO: Connect to:
 *   GET    /api/expenses?branch=&month=&year=  → load expenses
 *   POST   /api/expenses                        → add expense
 *   DELETE /api/expenses/:id                    → delete expense
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with GET /api/expenses
// Fields match Expense mongoose schema:
//   branch, title, amount, category, date, paidBy, notes
const INITIAL_EXPENSES = [
  { id: 1, title: 'Monthly Rent – Branch 1',     category: 'rent',        amount: 45000, date: '2026-04-01', branch: 'Branch 1', paidBy: 'Ali Hassan',   notes: 'Paid to landlord' },
  { id: 2, title: 'Electricity Bill – Branch 2', category: 'electricity', amount: 8200,  date: '2026-04-02', branch: 'Branch 2', paidBy: 'Ali Hassan',   notes: 'MEPCO bill April' },
  { id: 3, title: 'Packaging Material',           category: 'packaging',   amount: 3500,  date: '2026-04-03', branch: 'Branch 1', paidBy: 'Sara Ahmed',   notes: 'Boxes and bags' },
  { id: 4, title: 'Driver Salary Advance',        category: 'salary',      amount: 5000,  date: '2026-04-03', branch: 'Branch 1', paidBy: 'Ali Hassan',   notes: 'Advance for Imran' },
  { id: 5, title: 'Cleaning Supplies',            category: 'other',       amount: 1200,  date: '2026-04-04', branch: 'Branch 2', paidBy: 'Nadia Kausar', notes: 'Dettol and brooms' },
  { id: 6, title: 'Monthly Rent – Branch 2',     category: 'rent',        amount: 38000, date: '2026-04-01', branch: 'Branch 2', paidBy: 'Ali Hassan',   notes: 'Paid to landlord' },
];

// All expense categories — matches schema enum
const CATEGORIES = ['rent', 'electricity', 'packaging', 'salary', 'other'];

// Category badge colors
const CAT_COLORS = {
  rent:        'bg-purple-100 text-purple-700',
  electricity: 'bg-yellow-100 text-yellow-700',
  packaging:   'bg-blue-100   text-blue-700',
  salary:      'bg-green-100  text-green-700',
  other:       'bg-gray-100   text-gray-600',
};

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const EMPTY_FORM = {
  title: '', amount: '', category: 'rent',
  date: '', branch: 'Branch 1', paidBy: '', notes: '',
};

function Expenses() {
  const now = new Date();
  const [month, setMonth]       = useState(now.getMonth());
  const [branch, setBranch]     = useState('All');
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  // Filter by branch
  const filtered = expenses.filter(e =>
    (branch === 'All' || e.branch === branch)
  );

  // Total expenses in current view
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/expenses with form data
    const newId = Math.max(...expenses.map(e => e.id)) + 1;
    setExpenses(prev => [...prev, { ...form, id: newId, amount: Number(form.amount) }]);
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const confirmDelete = () => {
    // TODO: DELETE /api/expenses/:deleteId
    setExpenses(prev => prev.filter(e => e.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">

      {/* ── Filters Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Month filter */}
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          {/* Branch filter */}
          <div className="flex gap-1 bg-white border border-border rounded-lg p-1 shadow-sm">
            {['All', 'Branch 1', 'Branch 2'].map(b => (
              <button key={b} onClick={() => setBranch(b)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-150 ${branch === b ? 'text-white' : 'text-text-light hover:text-text-dark'}`}
                style={branch === b ? { backgroundColor: '#8B1A1A' } : {}}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* ── Total Summary ── */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-text-light uppercase tracking-wide">Total Expenses</p>
          <p className="font-heading font-bold text-2xl mt-1" style={{ color: '#8B1A1A' }}>
            Rs. {total.toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-text-light">{filtered.length} expense{filtered.length !== 1 ? 's' : ''} · {MONTHS[month]}</p>
      </div>

      {/* ── Expenses Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Title', 'Category', 'Amount', 'Date', 'Branch', 'Paid By', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-text-dark">{exp.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${CAT_COLORS[exp.category]}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-text-dark">Rs. {exp.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{exp.date}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{exp.branch}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{exp.paidBy}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteId(exp.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-text-light">No expenses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">Add New Expense</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Amount (Rs.) *</label>
                <input name="amount" type="number" value={form.amount} onChange={handleChange} required min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option>Branch 1</option><option>Branch 2</option>
                </select>
              </div>
              {/* Paid By */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Paid By</label>
                <input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder="Staff name"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              {/* Buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> Add Expense
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
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Expense?</h3>
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

export default Expenses;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/expenses
 * Features:
 *   - Month selector + branch filter tabs
 *   - Total expenses summary at top
 *   - Expenses table with category color badges
 *   - Add new expense modal form
 *   - Delete confirm dialog
 *
 * Schema fields used (Expense model):
 *   branch, title, amount, category, date, paidBy, notes
 *
 * TODO: Connect CRUD to /api/expenses endpoints using axios
 */
