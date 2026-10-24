/* ============================================================
   AICTE Complaint Monitoring System — Authentication Page
   Supports explicit credentials and one-click demo role switcher
   for testing all 7 implemented RBAC roles.
   ============================================================ */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { DEMO_ACCOUNTS, ROLE_COLORS } from '@/lib/constants';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin.demo@fictional-aicte.example');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  // If already logged in, redirect to intended page
  if (user && !loading) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError(null);
    setLoading(true);

    try {
      await login(demoEmail, 'Password@123');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate demo user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Banner: Official Branding & Context */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-950 p-12 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xs">
              <Building2 className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AICTE Complaint Portal</h1>
              <p className="text-xs text-navy-200">Grievance Redressal & Institutional Oversight</p>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4" />
              Backend-Enforced Role-Based Access Control
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
              Institutional Accountability & Multi-Bureau Governance
            </h2>
            <p className="text-sm leading-relaxed text-navy-200">
              A comprehensive system securing grievance intake, cross-bureau coordination,
              regional tracking, and auditor review across technical institutions nationwide.
            </p>

            <div className="mt-8 space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-navy-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Strict HTTP-only cookie sessions with anti-CSRF token verification</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-navy-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Bcrypt password hashing with automatic session expiration checks</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-navy-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>7 Explicit user roles with regional & bureau scoped data permissions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-navy-400 border-t border-white/10 pt-6">
          Demonstration Environment &bull; All institution & complaint data is fictional &bull; Fictional AICTE System
        </div>
      </div>

      {/* Right Content: Login Form & Demo Persona Switcher */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
              <Building2 className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AICTE Portal</h2>
              <p className="text-xs text-gray-500">Complaint Monitoring System</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your official credentials or choose a demonstration role below.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@fictional-aicte.example"
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:ring-offset-2 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1-Click Demonstration Personas
              </span>
              <span className="text-xs text-gray-400">7 Explicit Roles</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((account) => {
                const colorClass = ROLE_COLORS[account.role] || 'bg-gray-100 text-gray-700';
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleSelectDemo(account.email)}
                    disabled={loading}
                    className="flex w-full items-start justify-between rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-navy-300 hover:bg-navy-50/30 transition-all group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900 group-hover:text-navy-900">
                          {account.name}
                        </span>
                        <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-semibold ${colorClass}`}>
                          {account.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">{account.desc}</p>
                      <p className="text-[10px] font-mono text-gray-400">{account.email}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-navy-700 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
