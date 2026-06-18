import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * =========================
 * A route guard that enforces role-based access control on the frontend.
 *
 * HOW IT WORKS:
 *   1. While AuthContext is still loading (checking /api/auth/me), show a spinner.
 *   2. If the user is NOT logged in → redirect to /login.
 *   3. If `roles` prop is provided and the user's role is NOT in that array
 *      → redirect based on their role:
 *        - customer trying to access /admin/* → redirect to /  (home)
 *        - staff trying to access admin-only  → redirect to /admin/orders
 *   4. If all checks pass → render the protected children.
 *
 * USAGE IN App.jsx:
 * ──────────────────
 *   // Admin only (e.g. Dashboard, Staff Management):
 *   <Route path="/admin" element={
 *     <ProtectedRoute roles={['admin']}>
 *       <AdminLayout><AdminDashboard /></AdminLayout>
 *     </ProtectedRoute>
 *   } />
 *
 *   // Staff + Admin (e.g. Orders, Attendance):
 *   <Route path="/admin/orders" element={
 *     <ProtectedRoute roles={['admin', 'staff']}>
 *       <AdminLayout><ManageOrders /></AdminLayout>
 *     </ProtectedRoute>
 *   } />
 *
 *   // Any logged-in user (e.g. Profile):
 *   <Route path="/profile" element={
 *     <ProtectedRoute>
 *       <ProfilePage />
 *     </ProtectedRoute>
 *   } />
 *
 * PROPS:
 *   children  {ReactNode}   The page/component to render if access is granted.
 *   roles     {string[]}    Optional. Allowed roles. If omitted, any logged-in user passes.
 */
function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    // ── Step 1: Show a loading screen while AuthContext fetches /api/auth/me ──
    // Without this, a logged-in admin would get flashed to /login on page refresh
    // before the token is verified.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen"
                style={{ backgroundColor: '#F5F0EB' }}>
                <div className="flex flex-col items-center gap-4">
                    {/* Spinning ring */}
                    <div
                        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }}
                    />
                    <p className="font-body text-sm text-gray-500">Loading…</p>
                </div>
            </div>
        );
    }

    // ── Step 2: Not logged in → send to login ──
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ── Step 3: Role check (only when roles prop is provided) ──
    if (roles && !roles.includes(user.role)) {
        // Customer trying to reach any admin page → home
        if (user.role === 'customer') {
            return <Navigate to="/" replace />;
        }
        // Staff trying to reach an admin-only page → orders (their landing page)
        if (user.role === 'staff') {
            return <Navigate to="/admin/orders" replace />;
        }
        // Fallback — should not be reached with 3-role system
        return <Navigate to="/" replace />;
    }

    // ── Step 4: All checks passed → render the page ──
    return children;
}

export default ProtectedRoute;
