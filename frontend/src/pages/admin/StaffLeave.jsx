import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import api from '../../utils/api';

/**
 * StaffLeave Page
 * ================
 * Two sections:
 *   TOP: Pending leave requests (needs approval/rejection)
 *   BOTTOM: All leave history
 *
 * Route: /admin/leaves
 *
 * TODO: Connect to:
 *   GET /api/leaves              → load all leave requests
 *   PUT /api/leaves/:id/approve → approve a leave
 *   PUT /api/leaves/:id/reject  → reject a leave
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with GET /api/leaves
// Fields match StaffLeave mongoose schema:
//   staff, leaveType, startDate, endDate, reason, status
const INITIAL_LEAVES = [
  { id: 1, staffName: 'Sara Ahmed',   role: 'Cashier',  leaveType: 'sick',      startDate: '2026-04-06', endDate: '2026-04-07', reason: 'High fever and cold',              status: 'Pending'  },
  { id: 2, staffName: 'Imran Mirza',  role: 'Delivery', leaveType: 'casual',    startDate: '2026-04-08', endDate: '2026-04-08', reason: 'Family event',                     status: 'Pending'  },
  { id: 3, staffName: 'Nadia Kausar', role: 'Waiter',   leaveType: 'emergency', startDate: '2026-04-05', endDate: '2026-04-05', reason: 'Family emergency',                  status: 'Pending'  },
  { id: 4, staffName: 'Ali Hassan',   role: 'Manager',  leaveType: 'casual',    startDate: '2026-03-20', endDate: '2026-03-21', reason: 'Personal work',                    status: 'Approved' },
  { id: 5, staffName: 'Kamran Baig',  role: 'Chef',     leaveType: 'sick',      startDate: '2026-03-15', endDate: '2026-03-16', reason: 'Doctor appointment',               status: 'Approved' },
  { id: 6, staffName: 'Zara Malik',   role: 'Cleaner',  leaveType: 'unpaid',    startDate: '2026-03-10', endDate: '2026-03-12', reason: 'Personal trip',                    status: 'Rejected' },
  { id: 7, staffName: 'Sara Ahmed',   role: 'Cashier',  leaveType: 'sick',      startDate: '2026-02-25', endDate: '2026-02-25', reason: 'Severe headache',                  status: 'Approved' },
];

// Badge styles for each leave type
const TYPE_COLORS = {
  sick:      'bg-red-100 text-red-700',
  casual:    'bg-blue-100 text-blue-700',
  emergency: 'bg-orange-100 text-orange-700',
  unpaid:    'bg-gray-100 text-gray-600',
};

// Badge styles for each status
const STATUS_COLORS = {
  Pending:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Approved: 'bg-green-100 text-green-700 border border-green-200',
  Rejected: 'bg-red-100 text-red-600 border border-red-200',
};

function StaffLeave() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/api/leaves');
      if (res.data.success) {
        setLeaves(res.data.data.map(l => ({
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

  useEffect(() => { fetchLeaves(); }, []);

  // Pending requests needing action
  const pending = leaves.filter(l => l.status === 'Pending');

  // All other leaves (history)
  const history = leaves.filter(l => l.status !== 'Pending');

  // Approve a leave request
  const approve = async (id) => {
    try {
      await api.put(`/api/leaves/${id}/approve`);
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    } catch (err) {
      console.error(err);
    }
  };

  // Reject a leave request
  const reject = async (id) => {
    try {
      await api.put(`/api/leaves/${id}/reject`);
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    } catch (err) {
      console.error(err);
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
        {showActions ? (
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
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[leave.status]}`}>
            {leave.status}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

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

    </div>
  );
}

export default StaffLeave;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/leaves
 * Features:
 *   - TOP section: Pending requests with Approve / Reject buttons
 *   - BOTTOM section: Approved / Rejected history with status badges
 *   - Leave type badges: sick, casual, emergency, unpaid
 *   - Status badges: Pending (yellow), Approved (green), Rejected (red)
 *
 * Schema fields used (StaffLeave model):
 *   staff, leaveType, startDate, endDate, reason, status
 *
 * TODO:
 *   - GET /api/leaves to load all leave requests
 *   - PUT /api/leaves/:id/approve
 *   - PUT /api/leaves/:id/reject
 */
