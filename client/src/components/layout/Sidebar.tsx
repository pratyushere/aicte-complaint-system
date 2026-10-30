import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Building2,
  FileText,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  Shield,
  Users,
  GitCompareArrows,
  PanelLeftClose,
  PanelLeftOpen,
  FilePlus,
  Sparkles,
} from 'lucide-react';
import { ROLE_LABELS } from '@/lib/constants';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { stats, unreadNotificationCount, currentUser } = useAppStore();

  const navSections = [
    {
      label: 'Core Intelligence',
      items: [
        { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Grievance Operations',
      items: [
        {
          label: 'Complaints Registry',
          path: '/complaints',
          icon: FileText,
          badge: stats.totalComplaints,
          badgeColor: 'bg-slate-700 text-slate-200',
        },
        {
          label: 'Register Grievance',
          path: '/complaints/new',
          icon: FilePlus,
          highlight: true,
        },
        {
          label: 'AI Overlap Radar',
          path: '/overlaps',
          icon: AlertTriangle,
          badge: stats.pendingOverlaps > 0 ? stats.pendingOverlaps : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold pulse-indicator',
        },
        {
          label: 'Cross-Bureau Coordination',
          path: '/coordination',
          icon: GitCompareArrows,
        },
      ],
    },
    {
      label: 'Institutional Oversight',
      items: [
        { label: 'Institutions Directory', path: '/institutions', icon: Building2 },
        { label: 'Audits & Analytics Reports', path: '/reports', icon: BarChart3 },
      ],
    },
    {
      label: 'Governance & Access',
      items: [
        {
          label: 'Alerts & Notifications',
          path: '/notifications',
          icon: Bell,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
          badgeColor: 'bg-rose-500 text-white font-bold',
        },
        { label: 'User Directory & RBAC', path: '/users', icon: Users },
        { label: 'System Configuration', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 ease-in-out',
          'bg-[#0a1428] text-slate-100 border-r border-slate-800/80 shadow-xl',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/80 bg-slate-950/40 shrink-0 select-none">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-indigo-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0a1428] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0a1428] rounded-full" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white font-sans">
                  AICTE <span className="text-amber-400">VIGIL</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  v3.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                Grievance & Oversight Portal
              </p>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-2.5 overflow-y-auto space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                          : item.highlight
                            ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
                        collapsed && 'justify-center px-0 mx-auto w-11 h-11',
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        'w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                        collapsed ? 'mx-auto' : '',
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full shrink-0 leading-none shadow-xs',
                          item.badgeColor || 'bg-slate-800 text-slate-300',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && item.highlight && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Persona & Collapse Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0 space-y-2">
          {!collapsed ? (
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium truncate">
                    {currentUser.bureau?.code || 'HQ'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {ROLE_LABELS[currentUser.role]?.split(' ')[0] || 'Officer'}
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-4 ring-emerald-400/20" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 text-blue-200 font-bold text-xs flex items-center justify-center border border-blue-700/50">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-slate-400',
              'hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer select-none',
              collapsed && 'justify-center px-0',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-slate-300" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
