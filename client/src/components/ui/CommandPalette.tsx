import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import {
  Search,
  FileText,
  Building2,
  AlertTriangle,
  Plus,
  BarChart3,
  Users,
  Settings,
  Bell,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

const navigationItems = [
  { label: 'Executive Dashboard', path: '/dashboard', icon: Layers, category: 'Navigation' },
  { label: 'Citizen Portal', path: '/citizen', icon: Building2, category: 'Navigation' },
  { label: 'Complaints Registry', path: '/complaints', icon: FileText, category: 'Navigation' },
  { label: 'Register New Grievance', path: '/complaints/new', icon: Plus, category: 'Actions' },
  { label: 'Overlap Detection Radar', path: '/overlaps', icon: AlertTriangle, category: 'Navigation' },
  { label: 'Inter-Bureau Coordination', path: '/coordination', icon: Layers, category: 'Navigation' },
  { label: 'Institutions Directory', path: '/institutions', icon: Building2, category: 'Navigation' },
  { label: 'Regulatory Audits & Reports', path: '/reports', icon: BarChart3, category: 'Navigation' },
  { label: 'User Management & RBAC', path: '/users', icon: Users, category: 'Navigation' },
  { label: 'Portal Notifications', path: '/notifications', icon: Bell, category: 'Navigation' },
  { label: 'System Configuration', path: '/settings', icon: Settings, category: 'Navigation' },
];

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    complaints,
    institutions,
    switchPersona,
  } = useAppStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard navigation & close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    if (commandPaletteOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const filteredNav = useMemo(() => {
    if (!query) return navigationItems.slice(0, 6);
    return navigationItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const filteredComplaints = useMemo(() => {
    if (!query) return complaints.slice(0, 4);
    const q = query.toLowerCase();
    return complaints
      .filter(
        (c) =>
          c.trackingNumber.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.institution?.name.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [query, complaints]);

  const filteredInstitutions = useMemo(() => {
    if (!query) return institutions.slice(0, 3);
    const q = query.toLowerCase();
    return institutions
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.aicteId.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q),
      )
      .slice(0, 4);
  }, [query, institutions]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search complaints, AICTE IDs, or institutions..."
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-200/80 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 divide-y divide-slate-100">
          {/* Navigation / Actions */}
          {filteredNav.length > 0 && (
            <div className="pt-2 first:pt-0">
              <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Navigation & Actions
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Complaints */}
          {filteredComplaints.length > 0 && (
            <div className="pt-2">
              <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Complaints & Grievances
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredComplaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      navigate(`/complaints/${c.id}`);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group cursor-pointer text-left"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {c.trackingNumber}
                        </span>
                        <span className="text-xs font-medium text-slate-900 truncate">
                          {c.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.institution?.name} • Bureau: {c.bureau}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Institutions */}
          {filteredInstitutions.length > 0 && (
            <div className="pt-2">
              <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                AICTE Approved Institutions
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredInstitutions.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      navigate(`/institutions/${i.id}`);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-900">{i.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {i.aicteId} • {i.city}, {i.state}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick RBAC Persona Switching */}
          <div className="pt-2">
            <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Role Impersonation (RBAC)
            </p>
            <div className="grid grid-cols-2 gap-1 mt-1 px-1">
              {[
                { role: 'SYSTEM_ADMIN', label: 'System Admin (Full Access)' },
                { role: 'REGULATION_BUREAU_OFFICER', label: 'Regulation Bureau Officer' },
                { role: 'PGRC_OFFICER', label: 'PGRC Redressal Officer' },
                { role: 'READ_ONLY_AUDITOR', label: 'Read-Only Auditor' },
              ].map((p) => (
                <button
                  key={p.role}
                  onClick={() => {
                    switchPersona(p.role as any);
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-700 hover:bg-slate-100 transition-colors text-left"
                >
                  <Shield className="w-3 h-3 text-purple-600 shrink-0" />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white rounded border border-slate-200">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white rounded border border-slate-200">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>AICTE Executive Intelligent Command Console</span>
        </div>
      </div>
    </div>
  );
}
