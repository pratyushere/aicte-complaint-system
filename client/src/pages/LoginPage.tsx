import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { DEMO_ACCOUNTS, ROLE_COLORS } from '@/lib/constants';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Shield,
  KeyRound,
} from 'lucide-react';
import type { UserRole } from '@/types';

export function LoginPage() {
  const { switchPersona, addToast } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin.demo@fictional-aicte.example');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Find matching demo account or default to admin
      const match = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (match) {
        switchPersona(match.role as UserRole);
      } else {
        switchPersona('SYSTEM_ADMIN');
      }
      addToast({
        title: 'Authentication Successful',
        message: 'Welcome to AICTE VIGIL Executive Portal.',
        type: 'success',
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setLoading(true);
    switchPersona(account.role as UserRole);
    navigate(from, { replace: true });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Banner: Official Branding & Context */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[#060c18] via-[#0a192f] to-[#111f3d] p-12 text-white relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0a192f] rounded-[14px] flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AICTE VIGIL</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v3.2 Official
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All India Council for Technical Education • Ministry of Education
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Multi-Bureau Institutional Governance System
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
              Institutional Accountability & Real-Time Grievance Redressal
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              AICTE VIGIL integrates the Regulation Bureau, Public Grievance Redressal Cell (PGRC),
              Regional Directorates, and Senior Leadership into a unified oversight mesh with AI-assisted
              cross-bureau overlap detection.
            </p>

            <div className="mt-8 space-y-3 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>AI-assisted duplicate & cross-bureau overlap detection</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Role-Based Access Control across 7 explicit administrative tiers</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Strict statutory SLA monitoring with automated escalation triggers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800/80 pt-6 flex items-center justify-between">
          <span>Official Demonstration Environment</span>
          <span>Govt. of India Certified</span>
        </div>
      </div>

      {/* Right Content: Login Form & Demo Persona Switcher */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-y-auto bg-slate-950">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AICTE VIGIL</h2>
              <p className="text-xs text-slate-400">Grievance & Oversight Portal</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Executive Sign In</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Enter official credentials or select a demonstration identity below.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Official Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@aicte.gov.in"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition-all cursor-pointer"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Personas 1-Click Access */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                1-Click Demo Personas
              </span>
              <span className="text-[10px] text-slate-500 font-medium">7 Explicit RBAC Tiers</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((account) => {
                const colorClass = ROLE_COLORS[account.role] || 'bg-slate-800 text-slate-200';
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleSelectDemo(account)}
                    disabled={loading}
                    className="flex w-full items-start justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-slate-700 hover:bg-slate-900 transition-all group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {account.name}
                        </span>
                        <span className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${colorClass}`}>
                          {account.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">{account.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500">{account.email}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
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
