import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';
import { useState } from 'react';

const navSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Registry',
    items: [
      { label: 'Institutions', path: '/institutions', icon: Building2 },
      { label: 'Complaints', path: '/complaints', icon: FileText },
      { label: 'Register Complaint', path: '/complaints/new', icon: FilePlus },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { label: 'Overlap Detection', path: '/overlaps', icon: AlertTriangle },
      { label: 'Coordination', path: '/coordination', icon: GitCompareArrows },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'User Management', path: '/users', icon: Users },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-200',
        'bg-navy-900 text-white',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-navy-800 shrink-0">
        <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold leading-tight tracking-tight">AICTE</p>
            <p className="text-[10px] text-navy-300 leading-tight">Complaint Monitor</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <p className="px-4 py-1 text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 mx-2 px-2.5 py-2 rounded-md text-[13px] transition-colors',
                    isActive
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-navy-300 hover:bg-white/5 hover:text-white',
                    collapsed && 'justify-center px-0 mx-1',
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 py-2 border-t border-navy-800 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-[13px] text-navy-400',
            'hover:bg-white/5 hover:text-white transition-colors cursor-pointer',
            collapsed && 'justify-center px-0',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
