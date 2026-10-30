/* ============================================================
   Protected Route Component
   Guards frontend routes, redirecting unauthenticated users to /login
   and presenting an informative Access Denied screen if role is unauthorized.
   ============================================================ */

import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import type { UserRole } from '@/types';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-navy-700 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Verifying AICTE credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleLabel = ROLE_LABELS[user.role] || user.role;
    const roleColor = ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700';

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          This section is restricted to authorized personnel. Your current role does not have permission to view or manage this module.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs shadow-xs">
          <span className="text-gray-500">Current Role:</span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${roleColor}`}>
            {roleLabel}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
