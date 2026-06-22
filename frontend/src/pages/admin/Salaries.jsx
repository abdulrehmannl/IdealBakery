import React, { useState, useEffect, useRef } from 'react';
import { Check, DollarSign } from 'lucide-react';
import api from '../../utils/api';

/**
 * Salaries Page
 * ==============
 * Shows monthly salary sheet for all staff.
 * Admin can set bonus, deductions, and mark salary as Paid.
 * Net Salary = basicSalary + bonus - deductions (auto-calculated).
 *
 * Route: /admin/salaries
 *
 * API:
 *   GET  /api/salaries?month=MM&year=YYYY  → load salary records
 *   PUT  /api/salaries/:id                 → update bonus/deductions
 *   PUT  /api/salaries/:id/pay             → mark as paid
 */



// Month names for the selector dropdown
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function Salaries() {
  // Current selected month and year (defaults to current month)
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [year, setYear]   = useState(now.getFullYear());

  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimers = useRef({});

  const fetchSalaries = async () => {
    try {
      // month is 0-indexed in JS, but maybe 1-indexed in API? Assuming 1-indexed for API
      const res = await api.get(`/api/salaries?month=${month + 1}&year=${year}`);
      if (res.data.success) {
        setSalaries(res.data.data.map(s => ({
          ...s,
          id: s._id,
          staffName: s.staff?.name || 'Unknown',
          role: s.staff?.role || 'Staff',
          jobTitle: s.staff?.jobTitle || '',
          branch: s.staff?.branch?.name || 'Unknown Branch'
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSalaries(); }, [month, year]);

  /**
   * Update bonus or deductions for a specific record.
   * Net salary is always recalculated from these values.
   * Debounced: API call fires 600ms after the user stops typing.
   */
  const updateField = (id, field, value) => {
    const numericValue = Number(value) || 0;
    // Optimistic UI update immediately
    setSalaries(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: numericValue } : s)
    );
    // Cancel any pending timer for this record+field
    const timerKey = `${id}_${field}`;
    if (debounceTimers.current[timerKey]) {
      clearTimeout(debounceTimers.current[timerKey]);
    }
    // Schedule API call 600ms after last keystroke
    debounceTimers.current[timerKey] = setTimeout(async () => {
      try {
        await api.put(`/api/salaries/${id}`, { [field]: numericValue });
      } catch (err) {
        console.error('Failed to update salary field:', err);
      }
      delete debounceTimers.current[timerKey];
    }, 600);
  };

  /**
   * Mark a salary record as Paid.
   * Sets status = 'Paid' and records today's date as paidOn.
   */
  const markPaid = async (id) => {
    try {
      await api.put(`/api/salaries/${id}/pay`);
      const today = new Date().toISOString().split('T')[0];
      setSalaries(prev =>
        prev.map(s => s.id === id ? { ...s, status: 'paid', paidOn: today } : s)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── Summary totals ──────────────────────────────────────────────────────────
  const totalNet     = salaries.reduce((sum, s) => sum + ((s.basicSalary || 0) + (s.bonus || 0) - (s.deductions || 0)), 0);
  const totalPaid    = salaries.filter(s => s.status?.toLowerCase() === 'paid').reduce((sum, s) => sum + ((s.basicSalary || 0) + (s.bonus || 0) - (s.deductions || 0)), 0);
  const totalPending = salaries.filter(s => s.status?.toLowerCase() === 'pending').reduce((sum, s) => sum + ((s.basicSalary || 0) + (s.bonus || 0) - (s.deductions || 0)), 0);

  return (
    <div className="space-y-5">

      {/* ── Month / Year Selector ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DollarSign size={18} style={{ color: '#8B1A1A' }} />
          <label className="text-sm font-bold text-text-dark">Month:</label>
          {/* Month dropdown */}
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          {/* Year input */}
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white w-24 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="text-sm text-text-light">
          Showing salary sheet for <strong>{MONTHS[month]} {year}</strong>
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Payroll',     amount: totalNet,     color: '#8B1A1A', bg: '#fdf2f2' },
          { label: 'Total Paid',        amount: totalPaid,    color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Pending Payment',   amount: totalPending, color: '#d97706', bg: '#fffbeb' },
        ].map(({ label, amount, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-sm" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
            <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-1">{label}</p>
            <p className="font-heading font-bold text-xl" style={{ color }}>
              Rs. {amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Salary Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Staff Name', 'Role', 'Job Title', 'Branch', 'Basic Salary', 'Bonus', 'Deductions', 'Net Salary', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {salaries.map(s => {
                // Net Salary auto-calculates from basicSalary + bonus - deductions
                const net = s.basicSalary + s.bonus - s.deductions;
                return (
                  <tr key={s.id} className="hover:bg-secondary/20 transition-colors">

                    {/* Staff Name */}
                    <td className="px-4 py-3 font-bold text-text-dark whitespace-nowrap">{s.staffName}</td>

                    {/* Role */}
                    <td className="px-4 py-3 text-text-light text-xs capitalize">{s.role}</td>

                    {/* Job Title */}
                    <td className="px-4 py-3 text-text-light text-xs">{s.jobTitle || '—'}</td>

                    {/* Branch */}
                    <td className="px-4 py-3 text-text-light text-xs">{s.branch}</td>

                    {/* Basic Salary (editable input) */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.basicSalary}
                        onChange={e => updateField(s.id, 'basicSalary', e.target.value)}
                        min="0"
                        disabled={s.status?.toLowerCase() === 'paid'}
                        className="w-24 px-2 py-1.5 border border-border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:bg-gray-50 disabled:text-text-light"
                      />
                    </td>

                    {/* Bonus (editable input) */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.bonus}
                        onChange={e => updateField(s.id, 'bonus', e.target.value)}
                        min="0"
                        disabled={s.status?.toLowerCase() === 'paid'}
                        className="w-24 px-2 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:bg-gray-50 disabled:text-text-light"
                      />
                    </td>

                    {/* Deductions (editable input) */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.deductions}
                        onChange={e => updateField(s.id, 'deductions', e.target.value)}
                        min="0"
                        disabled={s.status?.toLowerCase() === 'paid'}
                        className="w-24 px-2 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:bg-gray-50 disabled:text-text-light"
                      />
                    </td>

                    {/* Net Salary — auto-calculated, not editable */}
                    <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">
                      Rs. {net.toLocaleString()}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        s.status?.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {s.status}
                        {s.status?.toLowerCase() === 'paid' && s.paidOn && (
                          <span className="ml-1 font-normal text-[10px]">({s.paidOn})</span>
                        )}
                      </span>
                    </td>

                    {/* Mark as Paid button — disabled if already paid */}
                    <td className="px-4 py-3">
                      {s.status?.toLowerCase() === 'pending' ? (
                        <button
                          onClick={() => markPaid(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                          style={{ backgroundColor: '#8B1A1A' }}
                        >
                          <Check size={12} /> Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <Check size={13} /> Paid
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Salaries;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/salaries
 * Features:
 *   - Month/Year selector at top
 *   - Summary cards: Total Payroll, Paid, Pending
 *   - Salary table with editable Bonus & Deductions fields
 *   - Net Salary auto-calculates: basicSalary + bonus - deductions
 *   - "Mark Paid" button per row; disabled once paid
 *   - Paid date shown in status badge
 *
 * Schema fields used (Salary model):
 *   staff, month, year, basicSalary, bonus, deductions, netSalary, status, paidOn
 */
