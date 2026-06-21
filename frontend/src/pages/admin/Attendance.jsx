import React, { useState, useEffect } from 'react';
import { Calendar, Clock, UserCheck } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const TODAY = new Date().toISOString().split('T')[0];

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  halfday: 'Half Day'
};

const STATUS_STYLES = {
  present:  { bg: '#16a34a', text: 'white' },
  absent:   { bg: '#dc2626', text: 'white' },
  late:     { bg: '#d97706', text: 'white' },
  halfday:  { bg: '#7c3aed', text: 'white' },
};

function Attendance() {
  const { user } = useAuth();
  
  // State for Admin & Manager
  const [date, setDate] = useState(TODAY);
  const [staffList, setStaffList] = useState([]);
  const [records, setRecords] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  
  // State for Staff/Delivery
  const [myHistory, setMyHistory] = useState([]);
  const [mySummary, setMySummary] = useState({ present: 0, late: 0, absent: 0, halfday: 0 });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch logic based on role
  useEffect(() => {
    if (!user) return;
    
    if (user.role === 'admin' || user.role === 'manager') {
      fetchAdminManagerData();
    } else {
      fetchMyAttendance();
    }
  }, [user, date, selectedBranch]);

  const fetchAdminManagerData = async () => {
    try {
      setIsLoading(true);
      // Fetch Staff
      let staffUrl = '/api/users';
      if (user.role === 'manager' && user.branch) {
        staffUrl = `/api/users?branch=${user.branch}`;
      } else if (user.role === 'admin' && selectedBranch !== 'All') {
        staffUrl = `/api/users?branch=${selectedBranch}`;
      } else {
        staffUrl = '/api/users';
      }
      
      const staffRes = await api.get(staffUrl);
      const allUsers = staffRes.data.success ? staffRes.data.users : [];
      // Filter out customers and admins
      const staffData = allUsers.filter(u => u.role !== 'customer' && u.role !== 'admin');
      
      setStaffList(staffData);

      // Fetch Branches for Admin dropdown
      if (user.role === 'admin' && branches.length === 0) {
        const branchRes = await api.get('/api/branches');
        if (branchRes.data.success) {
          setBranches(branchRes.data.data);
        }
      }

      // Fetch Attendance records for the date
      const attRes = await api.get(`/api/attendance?dateFrom=${date}&dateTo=${date}`);
      let attendanceData = attRes.data.success ? attRes.data.data : [];
      
      const mergedRecords = staffData.map(s => {
        const existing = attendanceData.find(a => (a.staff?._id || a.staff) === s._id || a.staffId === s._id);
        if (existing) {
          return { staffId: s._id, status: existing.status, arrivalTime: existing.arrivalTime || '09:00', leaveTime: existing.leaveTime || '18:00' };
        }
        return { staffId: s._id, status: 'present', arrivalTime: '09:00', leaveTime: '18:00' };
      });
      setRecords(mergedRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyAttendance = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/attendance/my-attendance');
      if (res.data.success) {
        setMyHistory(res.data.data);
        setMySummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecord = (staffId, field, value) => {
    setRecords(prev =>
      prev.map(r => r.staffId === staffId ? { ...r, [field]: value } : r)
    );
  };

  const countBy = (status) => records.filter(r => r.status === status).length;

  const handleSave = async () => {
    try {
      await api.post('/api/attendance', { date, records });
      alert('Attendance saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving attendance');
    }
  };

  // ── STAFF / DELIVERY VIEW ─────────────────────────────────────────────────────────────
  if (user?.role === 'staff' || user?.role === 'delivery') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-dark font-heading flex items-center gap-2">
          <UserCheck className="text-primary" /> My Attendance — {user.jobTitle || user.role}
        </h2>
        
        {/* Summary Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Present</p>
            <p className="text-3xl font-heading font-bold text-green-700 mt-1">{mySummary.present}</p>
            <p className="text-xs text-green-600 mt-1">This Month</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">Late</p>
            <p className="text-3xl font-heading font-bold text-amber-700 mt-1">{mySummary.late}</p>
            <p className="text-xs text-amber-600 mt-1">This Month</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-red-800 uppercase tracking-wide">Absent</p>
            <p className="text-3xl font-heading font-bold text-red-700 mt-1">{mySummary.absent}</p>
            <p className="text-xs text-red-600 mt-1">This Month</p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-5 py-3 font-bold text-text-light text-xs uppercase">Date</th>
                <th className="text-left px-5 py-3 font-bold text-text-light text-xs uppercase">Status</th>
                <th className="text-left px-5 py-3 font-bold text-text-light text-xs uppercase">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myHistory.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-text-light">No attendance records found.</td>
                </tr>
              ) : (
                myHistory.map(record => (
                  <tr key={record._id} className="hover:bg-secondary/20">
                    <td className="px-5 py-3 font-bold text-text-dark">
                      {new Date(record.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold" 
                        style={{ backgroundColor: STATUS_STYLES[record.status].bg + '20', color: STATUS_STYLES[record.status].bg }}>
                        {STATUS_LABELS[record.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-light">
                      {record.markedBy?.name || 'System'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── ADMIN & MANAGER VIEW ─────────────────────────────────────────────────────────────
  
  // Decide which buttons to show
  const availableStatuses = user?.role === 'manager' 
    ? ['present', 'late', 'absent'] 
    : ['present', 'absent', 'late', 'halfday'];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-primary" />
            <label className="text-sm font-bold text-text-dark">Date:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          {user?.role === 'admin' && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-text-dark">Branch:</label>
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All">All Branches</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm bg-primary"
        >
          Save Attendance
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Present',  count: countBy('present'),  color: '#16a34a' },
          { label: 'Absent',   count: countBy('absent'),   color: '#dc2626' },
          { label: 'Late',     count: countBy('late'),     color: '#d97706' },
          { label: 'Half Day', count: countBy('halfday'),  color: '#7c3aed' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-4 text-center shadow-sm" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
            <p className="font-heading font-bold text-2xl" style={{ color }}>{count}</p>
            <p className="text-xs font-bold text-text-light mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F5F0EB]">
                {['Staff Name', 'Role', 'Job Title', 'Branch', 'Status', 'Arrival Time', 'Leave Time'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-text-light text-xs uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staffList.map(staff => {
                const record = records.find(r => r.staffId === staff._id) || { status: 'present', arrivalTime: '09:00', leaveTime: '18:00' };
                return (
                  <tr key={staff._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-bold text-text-dark">{staff.name}</td>
                    <td className="px-5 py-3 text-text-light text-xs capitalize">{staff.role}</td>
                    <td className="px-5 py-3 text-text-light text-xs">{staff.jobTitle || <span className="capitalize">{staff.role}</span>}</td>
                    <td className="px-5 py-3 text-text-light text-xs">{staff.branch?.name || staff.branch}</td>
                    
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {availableStatuses.map(s => {
                          const isSelected = record.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => updateRecord(staff._id, 'status', s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                isSelected ? 'border-transparent shadow-sm' : 'border-border bg-white text-text-light hover:bg-secondary'
                              }`}
                              style={isSelected ? { backgroundColor: STATUS_STYLES[s].bg, color: STATUS_STYLES[s].text } : {}}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-text-light" />
                        <input
                          type="time"
                          value={record.arrivalTime}
                          onChange={e => updateRecord(staff._id, 'arrivalTime', e.target.value)}
                          className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
                          disabled={record.status === 'absent'}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-text-light" />
                        <input
                          type="time"
                          value={record.leaveTime}
                          onChange={e => updateRecord(staff._id, 'leaveTime', e.target.value)}
                          className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
                          disabled={record.status === 'absent'}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {staffList.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-light">
                    No staff found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
