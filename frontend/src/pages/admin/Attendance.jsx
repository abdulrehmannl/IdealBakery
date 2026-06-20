import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import api from '../../utils/api';

/**
 * Attendance Page
 * ================
 * Admin marks daily attendance for each staff member.
 * Each row has status buttons: Present / Absent / Late / Half Day
 * and optional arrival & leave time inputs.
 *
 * Route: /admin/attendance
 *
 * TODO: Connect to:
 *   GET /api/attendance?date=YYYY-MM-DD   → load attendance for that date
 *   POST /api/attendance                   → save/update attendance records
 */

// ── DUMMY STAFF LIST ─────────────────────────────────────────────────────────
// TODO: Replace with GET /api/staff (active staff only)
const STAFF_LIST = [
  { id: 1, name: 'Ali Hassan',   role: 'Manager',  branch: 'Branch 1' },
  { id: 2, name: 'Sara Ahmed',   role: 'Cashier',  branch: 'Branch 1' },
  { id: 3, name: 'Kamran Baig',  role: 'Chef',     branch: 'Branch 2' },
  { id: 4, name: 'Nadia Kausar', role: 'Waiter',   branch: 'Branch 2' },
  { id: 5, name: 'Imran Mirza',  role: 'Delivery', branch: 'Branch 1' },
  { id: 6, name: 'Zara Malik',   role: 'Cleaner',  branch: 'Branch 2' },
];

// All possible attendance statuses — matches Attendance schema enum
const STATUSES = ['Present', 'Absent', 'Late', 'Half Day'];

// Color for each status button (selected state)
const STATUS_STYLES = {
  Present:  { bg: '#16a34a', text: 'white' }, // green
  Absent:   { bg: '#dc2626', text: 'white' }, // red
  Late:     { bg: '#d97706', text: 'white' }, // amber
  'Half Day': { bg: '#7c3aed', text: 'white' }, // purple
};

// Today's date in YYYY-MM-DD format (used as default for the date picker)
const TODAY = new Date().toISOString().split('T')[0];

// Build initial attendance state: one record per staff member
// Each record matches the Attendance mongoose schema:
//   staff, date, status, arrivalTime, leaveTime
const buildInitialAttendance = () =>
  STAFF_LIST.map(s => ({
    staffId:     s.id,
    status:      'Present',   // default status = Present
    arrivalTime: '09:00',
    leaveTime:   '18:00',
  }));

function Attendance() {
  // Selected date (defaults to today)
  const [date, setDate] = useState(TODAY);
  const [staffList, setStaffList] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/api/attendance?date=${date}`);
      if (res.data.success) {
        // If data is returned, we need to map it. Assume backend returns { staff: [], records: [] } or we fetch staff separately.
        // Actually, let's just fetch staff once and attendance records based on date.
        // I will assume /api/attendance returns the records for the date. 
        // We also need staff list. I'll fetch staff first.
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaffAndAttendance = async () => {
    try {
      setIsLoading(true);
      // Fetch staff
      const staffRes = await api.get('/api/staff');
      const staffData = staffRes.data.success ? staffRes.data.data : [];
      setStaffList(staffData);

      // Fetch attendance
      const attRes = await api.get(`/api/attendance?date=${date}`);
      let attendanceData = attRes.data.success ? attRes.data.data : [];
      
      // Merge
      const mergedRecords = staffData.map(s => {
        const existing = attendanceData.find(a => a.staff === s._id || a.staffId === s._id);
        if (existing) {
          return { staffId: s._id, status: existing.status, arrivalTime: existing.arrivalTime, leaveTime: existing.leaveTime };
        }
        return { staffId: s._id, status: 'Present', arrivalTime: '09:00', leaveTime: '18:00' };
      });
      setRecords(mergedRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndAttendance();
  }, [date]);

  /**
   * Update one field for a specific staff member's attendance record.
   * @param {number} staffId   - the staff member's id
   * @param {string} field     - which field to update: 'status', 'arrivalTime', 'leaveTime'
   * @param {string} value     - new value
   */
  const updateRecord = (staffId, field, value) => {
    setRecords(prev =>
      prev.map(r => r.staffId === staffId ? { ...r, [field]: value } : r)
    );
  };

  // ── Summary counts ─────────────────────────────────────────────────────────
  // Count how many staff are Present, Absent, Late, Half Day today
  const countBy = (status) => records.filter(r => r.status === status).length;

  // ── Save all attendance records ────────────────────────────────────────────
  const handleSave = async () => {
    try {
      await api.post('/api/attendance', { date, records });
      alert('Attendance saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving attendance');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Date Selector + Save Button ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calendar size={18} style={{ color: '#8B1A1A' }} />
          <label className="text-sm font-bold text-text-dark">Date:</label>
          {/* Date picker — changing this should reload attendance for that day */}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {/* Save button — submits all attendance records */}
        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          Save Attendance
        </button>
      </div>

      {/* ── Summary Bar ── */}
      {/* Shows quick counts: Present / Absent / Late / Half Day */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Present',  count: countBy('Present'),  color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Absent',   count: countBy('Absent'),   color: '#dc2626', bg: '#fef2f2' },
          { label: 'Late',     count: countBy('Late'),     color: '#d97706', bg: '#fffbeb' },
          { label: 'Half Day', count: countBy('Half Day'), color: '#7c3aed', bg: '#f5f3ff' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-4 text-center shadow-sm" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
            <p className="font-heading font-bold text-2xl" style={{ color }}>{count}</p>
            <p className="text-xs font-bold text-text-light mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Attendance Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {['Staff Name', 'Role', 'Branch', 'Status', 'Arrival Time', 'Leave Time'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staffList.map(staff => {
                // Find this staff member's attendance record
                const record = records.find(r => r.staffId === staff._id) || { status: 'Present', arrivalTime: '09:00', leaveTime: '18:00' };
                return (
                  <tr key={staff._id} className="hover:bg-secondary/20 transition-colors">

                    {/* Staff Name */}
                    <td className="px-5 py-3 font-bold text-text-dark">{staff.name}</td>

                    {/* Role */}
                    <td className="px-5 py-3 text-text-light text-xs">{staff.role}</td>

                    {/* Branch */}
                    <td className="px-5 py-3 text-text-light text-xs">{staff.branch?.name || staff.branch}</td>

                    {/* ── Status Buttons ─────────────────────────────────────
                        Four buttons: Present / Absent / Late / Half Day
                        The selected one is filled with color, others are outlined.
                    ─────────────────────────────────────────────────────── */}
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {STATUSES.map(status => {
                          const isSelected = record.status === status;
                          const style = STATUS_STYLES[status];
                          return (
                            <button
                              key={status}
                              onClick={() => updateRecord(staff._id, 'status', status)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-150"
                              style={isSelected
                                ? { backgroundColor: style.bg, color: style.text, borderColor: style.bg }
                                : { backgroundColor: 'white', color: '#6B6B6B', borderColor: '#E8E0D8' }
                              }
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Arrival Time input */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-text-light" />
                        <input
                          type="time"
                          value={record.arrivalTime}
                          onChange={e => updateRecord(staff._id, 'arrivalTime', e.target.value)}
                          className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
                          // Disable if Absent — no arrival time needed
                          disabled={record.status === 'Absent'}
                        />
                      </div>
                    </td>

                    {/* Leave Time input */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-text-light" />
                        <input
                          type="time"
                          value={record.leaveTime}
                          onChange={e => updateRecord(staff._id, 'leaveTime', e.target.value)}
                          className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
                          disabled={record.status === 'Absent'}
                        />
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Save Button (convenience — same as top) ── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          Save Attendance
        </button>
      </div>

    </div>
  );
}

export default Attendance;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/attendance
 * Features:
 *   - Date selector (defaults to today)
 *   - Summary bar: Present / Absent / Late / Half Day counts
 *   - Table with one row per staff member
 *   - Per-row: 4 status toggle buttons + arrival time + leave time inputs
 *   - Save button submits all records
 *
 * Schema fields used (Attendance model):
 *   staff (staffId), date, status, arrivalTime, leaveTime
 *
 * TODO:
 *   - On date change: GET /api/attendance?date=YYYY-MM-DD
 *   - On save: POST /api/attendance { date, records[] }
 */
