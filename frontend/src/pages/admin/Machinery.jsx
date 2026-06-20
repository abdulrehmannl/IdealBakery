import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Wrench, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

/**
 * Machinery Page
 * ===============
 * Shows all bakery machines as cards (not a table).
 * Each card shows machine name, condition badge, purchase date,
 * warranty expiry, and a maintenance history list.
 *
 * Route: /admin/machinery
 *
 * TODO: Connect to:
 *   GET    /api/machinery?branch=   → load machines
 *   POST   /api/machinery           → add new machine
 *   PUT    /api/machinery/:id       → update machine
 *   DELETE /api/machinery/:id       → delete machine
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with GET /api/machinery
// Fields match the Machinery mongoose schema:
//   name, branch, purchaseDate, purchaseCost, condition, description,
//   warrantyExpiry, maintenanceHistory[]
const INITIAL_MACHINES = [
  {
    id: 1,
    name: 'Industrial Oven',
    branch: 'Branch 1',
    purchaseDate: '2022-06-15',
    purchaseCost: 450000,
    condition: 'Good',
    description: 'Main baking oven for breads and cakes. Capacity 60 trays.',
    warrantyExpiry: '2027-06-15',
    maintenanceHistory: [
      { date: '2025-01-10', note: 'Replaced heating element' },
      { date: '2024-08-05', note: 'Routine cleaning and calibration' },
    ],
  },
  {
    id: 2,
    name: 'Dough Mixer',
    branch: 'Branch 1',
    purchaseDate: '2023-03-20',
    purchaseCost: 85000,
    condition: 'Maintenance',
    description: '50L commercial spiral dough mixer.',
    warrantyExpiry: '2025-03-20',
    maintenanceHistory: [
      { date: '2026-03-01', note: 'Motor making noise — sent for repair' },
    ],
  },
  {
    id: 3,
    name: 'Display Refrigerator',
    branch: 'Branch 2',
    purchaseDate: '2023-09-01',
    purchaseCost: 120000,
    condition: 'Good',
    description: 'Glass-front chiller for displaying cakes and pastries.',
    warrantyExpiry: '2026-09-01',
    maintenanceHistory: [
      { date: '2025-06-12', note: 'Gas refilled' },
    ],
  },
  {
    id: 4,
    name: 'Deep Fryer',
    branch: 'Branch 2',
    purchaseDate: '2021-11-10',
    purchaseCost: 35000,
    condition: 'Broken',
    description: 'Used for samosa, pakora, and french fries.',
    warrantyExpiry: '2023-11-10',
    maintenanceHistory: [
      { date: '2026-02-14', note: 'Heating coil burnt — needs replacement' },
      { date: '2025-12-01', note: 'Thermostat repaired' },
    ],
  },
];

// Condition badge styling
// Good = green, Maintenance = yellow, Broken = red
const CONDITION_STYLES = {
  Good:        { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: CheckCircle },
  Maintenance: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', icon: Wrench       },
  Broken:      { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', icon: AlertCircle  },
};

const CONDITIONS = ['Good', 'Maintenance', 'Broken'];
const BRANCHES   = ['All', 'Branch 1', 'Branch 2'];

const EMPTY_FORM = {
  name: '', branch: 'Branch 1', purchaseDate: '', purchaseCost: '',
  condition: 'Good', description: '', warrantyExpiry: '',
};

function Machinery() {
  const [branchesList, setBranchesList] = useState([]);
  const [machines, setMachines]         = useState([]);
  const [branch, setBranch]             = useState('All');
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [historyId, setHistoryId]       = useState(null); // which machine's history is open
  const [deleteId, setDeleteId]         = useState(null);
  const [isLoading, setIsLoading]       = useState(true);

  const fetchInitialData = async () => {
    try {
      const [machRes, branchRes] = await Promise.all([
        api.get('/api/machinery'),
        api.get('/api/branches')
      ]);

      if (branchRes.data.success) {
        setBranchesList(branchRes.data.data);
      }

      if (machRes.data.success) {
        setMachines(machRes.data.data.map(m => ({
          ...m,
          id: m._id,
          purchaseDate: m.purchaseDate ? new Date(m.purchaseDate).toISOString().split('T')[0] : '',
          warrantyExpiry: m.warrantyExpiry ? new Date(m.warrantyExpiry).toISOString().split('T')[0] : '',
          maintenanceHistory: m.maintenanceHistory || []
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  // Filter machines by branch
  const filtered = branch === 'All' ? (machines || []) : (machines || []).filter(m => (m.branch?.name || m.branch) === branch);

  const openAdd  = () => { 
    setForm({
      ...EMPTY_FORM,
      branch: branchesList.length > 0 ? branchesList[0]._id : ''
    }); 
    setEditId(null); 
    setShowForm(true); 
  };
  const openEdit = (m) => {
    setForm({ name: m.name, branch: m.branch?._id || m.branch, purchaseDate: m.purchaseDate,
      purchaseCost: m.purchaseCost, condition: m.condition,
      description: m.description, warrantyExpiry: m.warrantyExpiry });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = { ...form, purchaseCost: Number(form.purchaseCost) };
    try {
      if (editId !== null) {
        await api.put(`/api/machinery/${editId}`, parsed);
      } else {
        await api.post('/api/machinery', parsed);
      }
      fetchInitialData();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/machinery/${deleteId}`);
      fetchInitialData();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Find the machine whose maintenance history is shown in the modal
  const historyMachine = (machines || []).find(m => m.id === historyId);

  if (isLoading) return <div className="p-8 text-center text-text-light">Loading...</div>;

  return (
    <div className="space-y-5">

      {/* ── Top Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Branch filter tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-lg p-1 shadow-sm">
          {['All', ...(branchesList || []).map(b => b.name)].map(b => (
            <button
              key={b}
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
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          <Plus size={16} /> Add Machine
        </button>
      </div>

      {/* ── Machine Cards Grid ── */}
      {/* Each machine is shown as a card, not a table row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(filtered || []).map(machine => {
          const cs = CONDITION_STYLES[machine.condition] || CONDITION_STYLES.Good;
          const ConditionIcon = cs.icon;

          // Check if warranty has expired
          const isWarrantyExpired = new Date(machine.warrantyExpiry) < new Date();

          return (
            <div
              key={machine.id}
              className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              {/* Card header: name + condition badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-text-dark">{machine.name}</h3>
                  <p className="text-xs text-text-light mt-0.5">{machine.branch?.name || machine.branch}</p>
                </div>
                {/* Condition badge */}
                <span
                  className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{ backgroundColor: cs.bg, borderColor: cs.border, color: cs.text }}
                >
                  <ConditionIcon size={12} />
                  {machine.condition}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-light leading-relaxed">{machine.description}</p>

              {/* Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-light">Purchase Date</span>
                  <span className="font-semibold text-text-dark">{machine.purchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Purchase Cost</span>
                  <span className="font-semibold text-text-dark">Rs. {Number(machine.purchaseCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Warranty Expiry</span>
                  <span className={`font-bold ${isWarrantyExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {machine.warrantyExpiry}
                    {isWarrantyExpired && ' (Expired)'}
                  </span>
                </div>
              </div>

              {/* Card actions */}
              <div className="flex gap-2 pt-1 border-t border-border mt-1">
                {/* Maintenance History button */}
                <button
                  onClick={() => setHistoryId(machine.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-text-light border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <Wrench size={13} /> History ({machine.maintenanceHistory.length})
                </button>
                <button
                  onClick={() => openEdit(machine)}
                  className="px-3 py-2 text-xs font-bold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(machine.id)}
                  className="px-3 py-2 text-xs font-bold text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-text-light">
            No machinery found for {branch}.
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Machine' : 'Add New Machine'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Machine Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {(branchesList || []).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Condition *</label>
                <select name="condition" value={form.condition} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Purchase Date</label>
                <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Purchase Cost (Rs.)</label>
                <input name="purchaseCost" type="number" value={form.purchaseCost} onChange={handleChange} min="0"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Warranty Expiry Date</label>
                <input name="warrantyExpiry" type="date" value={form.warrantyExpiry} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> {editId !== null ? 'Save Changes' : 'Add Machine'}
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

      {/* ── Maintenance History Modal ── */}
      {historyId && historyMachine && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-lg text-text-dark">Maintenance History</h3>
                <p className="text-xs text-text-light">{historyMachine.name}</p>
              </div>
              <button onClick={() => setHistoryId(null)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6">
              {historyMachine.maintenanceHistory.length === 0 ? (
                <p className="text-text-light text-sm text-center py-6">No maintenance records yet.</p>
              ) : (
                <div className="space-y-3">
                  {(historyMachine.maintenanceHistory || []).map((h, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xs font-bold text-text-light whitespace-nowrap">{h.date}</div>
                      <div className="text-sm text-text-dark">{h.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Machine?</h3>
            <p className="text-text-light text-sm mb-6">This will remove all maintenance history too.</p>
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

export default Machinery;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/machinery
 * Features:
 *   - Machine CARDS (not a table) — each card shows all machine details
 *   - Condition badge: Good (green), Maintenance (yellow), Broken (red)
 *   - Warranty expiry highlighted red if expired
 *   - Maintenance history modal per machine
 *   - Branch filter tabs (All / Branch 1 / Branch 2)
 *   - Add/Edit modal form + Delete confirm
 *
 * Schema fields used (Machinery model):
 *   name, branch, purchaseDate, purchaseCost, condition,
 *   description, warrantyExpiry, maintenanceHistory
 *
 * TODO: Connect CRUD to /api/machinery endpoints using axios
 */
