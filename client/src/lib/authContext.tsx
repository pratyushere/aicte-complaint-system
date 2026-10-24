/* ============================================================
   Authentication & RBAC Context
   Provides user session state, login/logout actions,
   and role-based permission helpers.
   ============================================================ */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { api, setCachedCsrfToken } from './api';

interface AuthContextType {
  user: User | null;
  csrfToken: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  canMutate: boolean;
  canRegisterComplaints: boolean;
  isSystemAdmin: boolean;
  isSeniorManagement: boolean;
  isReadOnlyAuditor: boolean;
  isRegionalOfficer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        if (res.data.csrfToken) {
          setCsrfToken(res.data.csrfToken);
          setCachedCsrfToken(res.data.csrfToken);
        }
      } else {
        setUser(null);
        setCsrfToken(null);
        setCachedCsrfToken(null);
      }
    } catch {
      setUser(null);
      setCsrfToken(null);
      setCachedCsrfToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string = 'Password@123') => {
    setLoading(true);
    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setCsrfToken(res.data.csrfToken);
        setCachedCsrfToken(res.data.csrfToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/api/v1/auth/logout');
    } catch {
      // Continue cleanup on client
    } finally {
      setUser(null);
      setCsrfToken(null);
      setCachedCsrfToken(null);
      setLoading(false);
    }
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    // Map of role to seed user email
    const roleEmailMap: Record<UserRole, string> = {
      SYSTEM_ADMIN: 'admin.demo@fictional-aicte.example',
      REGULATION_BUREAU_OFFICER: 'regulation.demo@fictional-aicte.example',
      PGRC_OFFICER: 'pgrc.demo@fictional-aicte.example',
      OTHER_BUREAU_OFFICER: 'otherbureau.demo@fictional-aicte.example',
      REGIONAL_OFFICER: 'regional.demo@fictional-aicte.example',
      SENIOR_MANAGEMENT: 'senior.demo@fictional-aicte.example',
      READ_ONLY_AUDITOR: 'auditor.demo@fictional-aicte.example',
    };

    const targetEmail = roleEmailMap[targetRole];
    if (targetEmail) {
      await login(targetEmail, 'Password@123');
    }
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canMutate = user ? user.role !== 'READ_ONLY_AUDITOR' : false;
  const canRegisterComplaints = user
    ? !['READ_ONLY_AUDITOR', 'SENIOR_MANAGEMENT'].includes(user.role)
    : false;
  const isSystemAdmin = user?.role === 'SYSTEM_ADMIN';
  const isSeniorManagement = user?.role === 'SENIOR_MANAGEMENT';
  const isReadOnlyAuditor = user?.role === 'READ_ONLY_AUDITOR';
  const isRegionalOfficer = user?.role === 'REGIONAL_OFFICER';

  return (
    <AuthContext.Provider
      value={{
        user,
        csrfToken,
        loading,
        login,
        logout,
        switchDemoRole,
        hasRole,
        canMutate,
        canRegisterComplaints,
        isSystemAdmin,
        isSeniorManagement,
        isReadOnlyAuditor,
        isRegionalOfficer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
