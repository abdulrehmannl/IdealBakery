import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import api from '../../utils/api';

/**
 * Reports Page
 * =============
 * Lets admin generate reports for sales, attendance, inventory, and salaries.
 * Route: /admin/reports
 *
 * TODO: Connect to:
 *   POST /api/reports/generate → { type, branch, dateFrom, dateTo } → returns report data
 */

// ── Report Types (tab navigation) ─────────────────────────────────────────────
const REPORT_TABS = ['Sales', 'Attendance', 'Inventory', 'Salary'];

// ── DUMMY DATA ──────────────────────────────────────────────────────────────
// TODO: Replace with real data from POST /api/reports/generate

// Each tab has its own summary cards and table data
const DUMMY_REPORTS = {
  Sales: {
    summary: [
      { label: 'Total Orders',   value: '124' },
      { label: 'Total Revenue',  value: 'Rs. 1,84,500' },
      { label: 'Avg Order Value',value: 'Rs. 1,488' },
      { label: 'Top Branch',    value: 'Branch 1' },
    ],
    headers: ['Date', 'Orders', 'Revenue', 'Branch'],
    rows: [
      ['2026-04-01', '18', 'Rs. 26,400', 'Branch 1'],
      ['2026-04-02', '22', 'Rs. 31,200', 'Branch 2'],
      ['2026-04-03', '15', 'Rs. 22,800', 'Branch 1'],
      ['2026-04-04', '28', 'Rs. 41,600', 'Both'],
      ['2026-04-05', '41', 'Rs. 62,500', 'Branch 1'],
    ],
  },
  Attendance: {
    summary: [
      { label: 'Total Working Days', value: '5' },
      { label: 'Avg Present',        value: '5.2 / 6' },
      { label: 'Total Absences',     value: '3' },
      { label: 'Total Late',         value: '2' },
    ],
    headers: ['Staff Name', 'Present Days', 'Absent Days', 'Late Days'],
    rows: [
      ['Ali Hassan',   '5', '0', '0'],
      ['Sara Ahmed',   '4', '1', '0'],
      ['Kamran Baig',  '5', '0', '0'],
      ['Nadia Kausar', '3', '1', '1'],
      ['Imran Mirza',  '4', '0', '1'],
      ['Zara Malik',   '5', '0', '0'],
    ],
  },
  Inventory: {
    summary: [
      { label: 'Total Items',    value: '8' },
      { label: 'Low Stock Items',value: '3' },
      { label: 'Total Value',    value: 'Rs. 42,650' },
      { label: 'Items Used',     value: '12 this week' },
    ],
    headers: ['Item', 'Branch', 'Quantity', 'Status'],
    rows: [
      ['All-Purpose Flour', 'Branch 1', '3 kg',    'LOW STOCK'],
      ['Sugar',             'Branch 1', '25 kg',   'OK'],
      ['Whipping Cream',    'Branch 2', '2 L',     'LOW STOCK'],
      ['Dark Chocolate',    'Branch 1', '1 kg',    'LOW STOCK'],
      ['Butter',            'Branch 2', '12 kg',   'OK'],
      ['Eggs',             'Branch 1', '8 dozen', 'OK'],
    ],
  },
  Salary: {
    summary: [
      { label: 'Total Payroll',   value: 'Rs. 1,73,000' },
      { label: 'Paid',            value: 'Rs. 70,000' },
      { label: 'Pending',         value: 'Rs. 1,03,000' },
      { label: 'Total Staff',     value: '6' },
    ],
    headers: ['Staff Name', 'Basic Salary', 'Net Salary', 'Status'],
    rows: [
      ['Ali Hassan',   'Rs. 45,000', 'Rs. 48,000', 'Paid'],
      ['Sara Ahmed',   'Rs. 28,000', 'Rs. 27,000', 'Pending'],
      ['Kamran Baig',  'Rs. 35,000', 'Rs. 37,000', 'Pending'],
      ['Nadia Kausar', 'Rs. 22,000', 'Rs. 21,500', 'Pending'],
      ['Imran Mirza',  'Rs. 25,000', 'Rs. 26,500', 'Paid'],
      ['Zara Malik',   'Rs. 18,000', 'Rs. 18,000', 'Pending'],
    ],
  },
};

function Reports() {
  const [activeTab, setActiveTab] = useState('Sales');
  const [dateFrom, setDateFrom]   = useState('2026-04-01');
  const [dateTo, setDateTo]       = useState('2026-04-05');
  const [branch, setBranch]       = useState('All');

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate "generate report" — in real app this calls the API
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/reports', { type: activeTab, branch, dateFrom, dateTo });
      if (res.data.success) {
        setReportData(res.data.data);
      } else {
        // Fallback for demonstration
        setReportData(DUMMY_REPORTS[activeTab]);
      }
    } catch (err) {
      console.error(err);
      // Fallback for demonstration
      setReportData(DUMMY_REPORTS[activeTab]);
    } finally {
      setIsLoading(false);
    }
  };

  const report = reportData || DUMMY_REPORTS[activeTab];

  return (
    <div className="space-y-5">

      {/* ── Report Type Tabs ── */}
      <div className="flex gap-1 bg-white border border-border rounded-xl p-1.5 w-fit shadow-sm">
        {REPORT_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 flex items-center gap-2 ${
              activeTab === tab ? 'text-white' : 'text-text-light hover:text-text-dark hover:bg-secondary'
            }`}
            style={activeTab === tab ? { backgroundColor: '#8B1A1A' } : {}}
          >
            <BarChart2 size={14} />
            {tab} Report
          </button>
        ))}
      </div>

      {/* ── Filters Row ── */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-wrap items-end gap-4">
        {/* From date */}
        <div>
          <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        {/* To date */}
        <div>
          <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        {/* Branch filter */}
        <div>
          <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch</label>
          <select value={branch} onChange={e => setBranch(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="All">All Branches</option>
            <option>Branch 1</option>
            <option>Branch 2</option>
          </select>
        </div>
        <button onClick={handleGenerate} disabled={isLoading}
          className="px-5 py-2 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          style={{ backgroundColor: '#8B1A1A' }}>
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {report.summary.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-1">{label}</p>
            <p className="font-heading font-bold text-xl text-text-dark">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Chart Placeholder ── */}
      {/* TODO: Replace this div with a real Chart.js or Recharts chart later */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center">
        <div className="h-48 flex flex-col items-center justify-center gap-3 bg-secondary/30 rounded-lg border-2 border-dashed border-border">
          <BarChart2 size={40} className="text-text-light opacity-40" />
          <p className="text-text-light font-bold text-sm">Chart will appear here</p>
          <p className="text-text-light text-xs">Chart.js integration coming in a future update</p>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-heading font-bold text-base text-text-dark">{activeTab} Report Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {report.headers.map(h => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-text-light text-xs tracking-wide uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {report.rows.map((row, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-5 py-3 text-sm ${j === 0 ? 'font-bold text-text-dark' : 'text-text-light'}`}>
                      {/* Highlight LOW STOCK / status cells */}
                      {cell === 'LOW STOCK' ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{cell}</span>
                      ) : cell === 'OK' ? (
                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">{cell}</span>
                      ) : cell === 'Paid' ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{cell}</span>
                      ) : cell === 'Pending' ? (
                        <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">{cell}</span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Reports;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/reports
 * Features:
 *   - 4 report type tabs: Sales / Attendance / Inventory / Salary
 *   - Date range picker (From / To) + branch filter
 *   - "Generate Report" button (connect to API later)
 *   - Summary cards (4 per report type)
 *   - Chart placeholder (Chart.js coming later)
 *   - Data table with colored status badges
 *
 * Schema fields used (Report model):
 *   title, type, branch, dateFrom, dateTo, summary, data
 *
 * TODO: Connect to POST /api/reports/generate { type, branch, dateFrom, dateTo }
 */
