import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Reports Page
 * =============
 * Lets admin generate reports for sales, attendance, inventory, and salaries.
 * Route: /admin/reports
 *
 * Dynamic Data:
 *   POST /api/reports → { title, type, branch, dateFrom, dateTo } → returns report data
 */

function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Sales');
  const [dateFrom, setDateFrom]   = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo]       = useState(new Date().toISOString().split('T')[0]);
  const [branch, setBranch]       = useState('All');

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map API response to the format expected by the UI
  const formatReportData = (type, dataObj) => {
    if (!dataObj) return null;
    
    switch (type.toLowerCase()) {
      case 'sales':
        return {
          summary: [
            { label: 'Total Orders',   value: dataObj.totalOrders || 0 },
            { label: 'Total Revenue',  value: `Rs. ${dataObj.totalRevenue || 0}` },
            { label: 'Avg Order Value',value: `Rs. ${dataObj.totalOrders ? Math.round(dataObj.totalRevenue / dataObj.totalOrders) : 0}` },
            { label: 'Pending Orders', value: dataObj.byStatus?.pending || 0 },
          ],
          headers: ['Status', 'Count'],
          rows: [
            ['Pending', dataObj.byStatus?.pending || 0],
            ['Confirmed', dataObj.byStatus?.confirmed || 0],
            ['Preparing', dataObj.byStatus?.preparing || 0],
            ['Delivered', dataObj.byStatus?.delivered || 0],
            ['Cancelled', dataObj.byStatus?.cancelled || 0],
          ]
        };
      case 'attendance':
        const headers = ['Status', 'Count'];
        let rows = [
            ['Present', dataObj.present || 0],
            ['Absent', dataObj.absent || 0],
            ['Late', dataObj.late || 0],
            ['Half-day', dataObj.halfday || 0],
        ];

        if (dataObj.byJobTitle) {
          headers.push('Breakdown by Job Title');
          rows = Object.keys(dataObj.byJobTitle).map(title => {
            const counts = dataObj.byJobTitle[title];
            return [
              title, 
              (counts.present + counts.absent + counts.late + counts.halfday),
              `P: ${counts.present} | A: ${counts.absent} | L: ${counts.late}`
            ];
          });
          // Update headers to match
          headers.splice(0, headers.length, 'Job Title', 'Total Records', 'Breakdown (P/A/L)');
        }

        return {
          summary: [
            { label: 'Total Records', value: dataObj.totalRecords || 0 },
            { label: 'Present',       value: dataObj.present || 0 },
            { label: 'Absent',        value: dataObj.absent || 0 },
            { label: 'Late',          value: dataObj.late || 0 },
          ],
          headers,
          rows
        };
      case 'inventory':
        return {
          summary: [
            { label: 'Total Items',    value: dataObj.totalItems || 0 },
            { label: 'Low Stock Items',value: dataObj.lowStockItems || 0 },
            { label: 'Total Value',    value: `Rs. ${dataObj.totalCostValue || 0}` },
          ],
          headers: ['Low Stock Item Name'],
          rows: (dataObj.lowStockNames || []).map(name => [name])
        };
      case 'salary':
        return {
          summary: [
            { label: 'Total Records', value: dataObj.totalRecords || 0 },
            { label: 'Total Paid',    value: `Rs. ${dataObj.totalPaid || 0}` },
            { label: 'Total Pending', value: `Rs. ${dataObj.totalPending || 0}` },
          ],
          headers: ['Status', 'Staff Count', 'Amount'],
          rows: [
            ['Paid', dataObj.paidCount || 0, `Rs. ${dataObj.totalPaid || 0}`],
            ['Pending', dataObj.pendingCount || 0, `Rs. ${dataObj.totalPending || 0}`],
          ]
        };
      default:
        return null;
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        title: `${activeTab} Report (${dateFrom} to ${dateTo})`,
        type: activeTab.toLowerCase(),
        branch: branch === 'All' ? null : branch, // Note: ideally branch should be the ObjectId, but for now we send what we have
        generatedBy: user?.id,
        dateFrom,
        dateTo
      };
      
      const res = await api.post('/api/reports', payload);
      if (res.data.success) {
        setReportData(formatReportData(activeTab, res.data.data.data));
      } else {
        setError(res.data.message || 'Failed to generate report');
        setReportData(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while generating the report.');
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Report Type Tabs ── */}
      <div className="flex gap-1 bg-white border border-border rounded-xl p-1.5 w-fit shadow-sm">
        {['Sales', 'Attendance', 'Inventory', 'Salary'].map(tab => (
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

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* ── Empty State ── */}
      {!reportData && !isLoading && !error && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-12 text-center">
          <BarChart2 size={48} className="mx-auto text-border mb-4" />
          <h3 className="font-heading font-bold text-xl text-text-dark mb-2">No Report Generated</h3>
          <p className="text-text-light text-sm">Select your filters and click "Generate Report" to view data.</p>
        </div>
      )}

      {reportData && (
        <>
          {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {reportData.summary.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <p className="text-xs font-bold text-text-light uppercase tracking-wide mb-1">{label}</p>
            <p className="font-heading font-bold text-xl text-text-dark">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Simple CSS Bar Chart ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h3 className="font-heading font-bold text-base text-text-dark mb-6">{activeTab} Chart</h3>
        <div className="h-64 flex items-end justify-around gap-2 bg-secondary/10 rounded-lg p-4 border border-border/50 relative pt-10">
          {reportData.rows.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-light">
               <BarChart2 size={40} className="opacity-40 mb-2" />
               <p className="font-bold text-sm">No data to display</p>
            </div>
          ) : (
            (() => {
              // Extract numeric values from rows (assuming second column is a number or value)
              const chartData = reportData.rows.map(row => {
                let val = String(row[1] || row[0] || 0); // fallback to col 0 if needed
                let num = parseFloat(val.replace(/[^0-9.]/g, ''));
                if (isNaN(num)) num = 0;
                return { label: row[0], value: num, raw: row[1] || row[0] };
              });
              
              const maxVal = Math.max(...chartData.map(d => d.value), 1);
              
              return chartData.map((d, i) => {
                const heightPercent = (d.value / maxVal) * 100;
                return (
                  <div key={i} className="flex flex-col items-center justify-end w-full max-w-[60px] group h-full relative">
                    <div className="absolute -top-6 bg-text-dark text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {d.label}: {d.raw}
                    </div>
                    <div 
                      className="w-full bg-primary rounded-t-sm transition-all duration-500 ease-out hover:bg-[#6A1414] shadow-sm relative overflow-hidden" 
                      style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <span className="text-[10px] font-bold text-text-light mt-3 truncate w-full text-center" title={d.label}>
                      {String(d.label).substring(0, 10)}{String(d.label).length > 10 ? '...' : ''}
                    </span>
                  </div>
                );
              });
            })()
          )}
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-heading font-bold text-base text-text-dark">{activeTab} Report Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          {reportData.rows.length === 0 ? (
            <div className="p-8 text-center text-text-light text-sm">No data available for this breakdown.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                  {reportData.headers.map(h => (
                    <th key={h} className="text-left px-5 py-3 font-bold text-text-light text-xs tracking-wide uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reportData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-5 py-3 text-sm ${j === 0 ? 'font-bold text-text-dark' : 'text-text-light'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
        </>
      )}

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
 * Dynamic Data: Connects to POST /api/reports
 */
