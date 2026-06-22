import React, { useState, useEffect } from 'react';
import { Check, X, Plus } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

/**
 * StaffLeave Page
 * ================
 * Two sections:
 *   TOP: Pending leave requests (needs approval/rejection)
 *   BOTTOM: All leave history
 *
 * Route: /admin/leaves
 */

// Badge styles for each leave type
const TYPE_COLORS = {
  sick:      'bg-red-100 text-red-700',
  casual:    'bg-blue-100 text-blue-700',
  emergency: 'bg-orange-100 text-orange-700',
  unpaid:    'bg-gray-100 text-gray-600',
};

// Badge styles for each status (lowercase as from backend)
const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-100 text-green-700 border border-green-200',
  rejected: 'bg-red-100 text-red-600 border border-red-200',
};

function StaffLeave() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';
  
  const [leaves, setLeaves] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    staff: '', leaveType: 'casual', startDate: '', endDate: '', reason: ''
  });

  const fetchInitialData = async () => {
    try {
      const [leavesRes, staffRes] = await Promise.all([
        api.get('/api/leaves'),
        api.get('/api/users')
      ]);

      if (staffRes.data.success) {
        setStaffList(staffRes.data.users);
      }
      
      if (leavesRes.data.success) {
        setLeaves(leavesRes.data.data.map(l => ({
          ...l,
          id: l._id,
          staffName: l.staff?.name || 'Unknown',
          role: l.staff?.role || 'Staff',
          startDate: new Date(l.startDate).toISOString().split('T')[0],
          endDate: new Date(l.endDate).toISOString().split('T')[0]
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  let filteredStaffList = isAdminOrManager 
    ? staffList 
    : staffList.filter(s => String(s._id) === String(user?.id || user?._id));

  // Fallback: If we couldn't find the user in the fetched list for any reason, force add them
  // so they can still submit leaves using their own ID.
  if (!isAdminOrManager && filteredStaffList.length === 0 && user) {
    filteredStaffList = [{ _id: user.id || user._id, name: user.name, role: user.role }];
  }

  const visibleLeaves = isAdminOrManager
    ? leaves
    : leaves.filter(l => {
        const leaveStaffId = typeof l.staff === 'object' ? l.staff?._id : l.staff;
        return String(leaveStaffId) === String(user?.id || user?._id);
      });

  // Pending requests needing action
  const pending = visibleLeaves.filter(l => l.status === 'pending');

  // All other leaves (history)
  const history = visibleLeaves.filter(l => l.status !== 'pending');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/leaves', form);
      setShowForm(false);
      setForm({ staff: staffList.length > 0 ? staffList[0]._id : '', leaveType: 'casual', startDate: '', endDate: '', reason: '' });
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add leave request.');
    }
  };

  // Approve a leave request
  const approve = async (id) => {
    try {
      await api.put(`/api/leaves/${id}`, { status: 'approved' });
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  // Reject a leave request
  const reject = async (id) => {
    try {
      await api.put(`/api/leaves/${id}`, { status: 'rejected' });
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  // Reusable leave card row
  const LeaveRow = ({ leave, showActions }) => (
    <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
      {/* Staff info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-text-dark">{leave.staffName}</p>
          <span className="text-xs text-text-light">({leave.role})</span>
          {/* Leave type badge */}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[leave.leaveType]}`}>
            {leave.leaveType}
          </span>
        </div>
        {/* Date range */}
        <p className="text-xs text-text-light mt-1">
          📅 {leave.startDate} → {leave.endDate}
        </p>
        {/* Reason */}
        <p className="text-sm text-text-dark mt-1">{leave.reason}</p>
      </div>

      {/* Right side: status + action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {showActions && isAdminOrManager ? (
          // Approve / Reject buttons for pending requests
          <>
            <button
              onClick={() => approve(leave.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity bg-green-600"
            >
              <Check size={13} /> Approve
            </button>
            <button
              onClick={() => reject(leave.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity bg-red-500"
            >
              <X size={13} /> Reject
            </button>
          </>
        ) : (
          // Status badge for history
          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[leave.status]}`}>
            {leave.status}
          </span>
        )}
      </div>
    </div>
  );

  if (isLoading) return <div className="p-8 text-center text-text-light">Loading...</div>;

  return (
    <div className="space-y-6">

      <div className="flex justify-end">
        <button
          onClick={() => {
            if (!isAdminOrManager && filteredStaffList.length === 0) {
              alert("Your staff profile could not be found in the system. Please ensure your name or phone number exactly matches the Staff records, or contact an Administrator.");
              return;
            }
            setForm(prev => ({ ...prev, staff: filteredStaffList.length > 0 ? filteredStaffList[0]._id : '' }));
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          <Plus size={16} /> Add Leave Request
        </button>
      </div>

      {/* ══════════════════════════
          TOP: Pending Requests
      ══════════════════════════ */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-text-dark">
            Pending Requests
          </h3>
          {/* Count badge */}
          {pending.length > 0 && (
            <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: '#8B1A1A' }}>
              {pending.length} pending
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-10 text-text-light font-body text-sm">
            ✅ No pending leave requests
          </div>
        ) : (
          <div>
            {pending.map(leave => (
              <LeaveRow key={leave.id} leave={leave} showActions={true} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════
          BOTTOM: Leave History
      ══════════════════════════ */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-heading font-bold text-base text-text-dark">Leave History</h3>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-10 text-text-light text-sm">No leave history yet.</div>
        ) : (
          <div>
            {history.map(leave => (
              <LeaveRow key={leave.id} leave={leave} showActions={false} />
            ))}
          </div>
        )}
      </div>

      {/* ── Add Leave Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">Apply for Leave</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {isAdminOrManager ? (
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Staff Member *</label>
                  <select name="staff" value={form.staff} onChange={handleChange} required
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="" disabled>Select Staff</option>
                    {staffList.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
              ) : (
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Staff Member</label>
                  <div className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-gray-50 text-text-light">
                    {user?.name} ({user?.role})
                  </div>
                  {/* Hidden input to ensure form submission has the value if needed, though form state handles it */}
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Leave Type *</label>
                <select name="leaveType" value={form.leaveType} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Start Date *</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">End Date *</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Reason *</label>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} required
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}>
                  <Check size={15} /> Submit Leave Request
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

    </div>
  );
}

export default StaffLeave;
