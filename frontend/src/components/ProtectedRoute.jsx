import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F5F0EB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Not logged in -> redirect to login, saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in, but wrong role.
        if (user.role === 'customer') {
            return <Navigate to="/" replace />;
        }
        if (user.role === 'staff' || user.role === 'delivery') {
            return <Navigate to="/admin/orders" replace />;
        }
        if (user.role === 'manager') {
            return <Navigate to="/admin" replace />;
        }
        // Fallback for unknown roles
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
