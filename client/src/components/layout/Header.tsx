import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { DEMO_ACCOUNTS, ROLE_LABELS } from '@/lib/constants';
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  Shield,
  Plus,
  AlertTriangle,
  Clock,
  CheckCheck,
  UserCheck,
  Lock,
  Building2,
  Scale,
  PhoneCall,
  Mail,
  Home,
  FileText,
  Layers,
  GitCompareArrows,
  BarChart3,
  Users,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { cn, relativeTime, initials } from '@/lib/utils';
import type { UserRole } from '@/types';

export function Header() {
  const {
    currentUser,
    switchPersona,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCommandPaletteOpen,
    setTrackModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    stats,
  } = useAppStore();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobilePersonaDrawer, setMobilePersonaDrawer] = useState(false);
  const [notifTab, setNotifTab] = useState<'ALL' | 'UNREAD' | 'OVERLAPS'>('ALL');

  const personaRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setPersonaOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  const prevPathnameRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      setMobileMenuOpen(false);
      setMobilePersonaDrawer(false);
    }
  }, [location.pathname, setMobileMenuOpen]);

  const filteredNotifs = notifications.filter((n) => {
    if (notifTab === 'UNREAD') return !n.isRead;
    if (notifTab === 'OVERLAPS') return n.type === 'OVERLAP_DETECTED';
    return true;
  });

  const navLinks = [
    { label: 'Citizen Portal', path: '/citizen', icon: Home },
    { label: 'Register Grievance', path: '/complaints/new', icon: Plus },
    { label: 'Grievance Registry', path: '/complaints', icon: FileText },
    { label: 'Institutions', path: '/institutions', icon: Building2 },
    { label: 'AI Overlap Radar', path: '/overlaps', icon: Layers, badge: stats.pendingOverlaps > 0 ? stats.pendingOverlaps : undefined },
    { label: 'Coordination Hub', path: '/coordination', icon: GitCompareArrows },
    { label: 'Officer Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Reports & SLA', path: '/reports', icon: Scale },
    { label: 'Ombudsman & Officers', path: '/users', icon: Users },
    { label: 'Help & Settings', path: '/settings', icon: Settings },
  ];

  const isCurrentActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Official Government Branding Header */}
      <div className="bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: AICTE Circular Emblem + Bilingual Portal Title */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3.5 group cursor-pointer min-w-0">
            {/* National AICTE Emblem Badge */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-[#0c3978] p-0.5 shrink-0 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
                <Building2 className="w-5 h-5 sm:w-8 sm:h-8 text-[#0c3978]" />
              </div>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600 block leading-tight truncate">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Ministry of Education
              </span>
              <h1 className="text-xs sm:text-lg lg:text-xl font-extrabold text-[#0c3978] tracking-tight leading-tight group-hover:text-blue-800 transition-colors truncate">
                AICTE SAMADHAN Portal
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block leading-tight">
                Government of India • Unified Redressal Mechanism & Multi-Bureau Coordination
              </p>
            </div>
          </Link>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* National Emblem Badge (Ashoka Lion Capital) */}
            <div className="hidden lg:flex items-center gap-2.5 pr-2.5 border-r border-slate-200">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  सत्यमेव जयते
                </span>
                <span className="text-xs font-bold text-[#0c3978] block">
                  AICTE SAMADHAN 3.0
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 shadow-2xs">
                <Scale className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* Quick Search Shortcut */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95 touch-manipulation"
              title="Search Portal (⌘K)"
              aria-label="Search Portal"
            >
              <Search className="w-4 h-4 text-slate-500 sm:text-slate-400" />
              <span className="text-[11px] font-medium hidden md:inline">Quick Search</span>
              <kbd className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 font-bold hidden sm:inline-block">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Center */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setPersonaOpen(false);
                  setProfileOpen(false);
                }}
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                aria-label="View notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Portal Notifications
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {unreadNotificationCount} unread regulatory alerts
                      </p>
                    </div>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 px-3 pt-2 gap-2 text-xs bg-white">
                    {(['ALL', 'UNREAD', 'OVERLAPS'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setNotifTab(tab)}
                        className={cn(
                          'pb-2 px-2 text-xs font-medium border-b-2 transition-colors cursor-pointer',
                          notifTab === tab
                            ? 'border-[#0c3978] text-[#0c3978] font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-800',
                        )}
                      >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>

                  {/* Notification Items */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications in this category.
                      </div>
                    ) : (
                      filteredNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            setNotifOpen(false);
                            if (n.type === 'OVERLAP_DETECTED') {
                              navigate('/overlaps');
                            } else if (n.referenceType === 'complaint') {
                              navigate(`/complaints/${n.referenceId}`);
                            }
                          }}
                          className={cn(
                            'p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start gap-3',
                            !n.isRead && 'bg-blue-50/30',
                          )}
                        >
                          <div
                            className={cn(
                              'p-2 rounded-lg shrink-0 mt-0.5',
                              n.type === 'OVERLAP_DETECTED'
                                ? 'bg-amber-100 text-amber-700'
                                : n.type === 'DEADLINE_WARNING'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-blue-100 text-[#0c3978]',
                            )}
                          >
                            {n.type === 'OVERLAP_DETECTED' ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : n.type === 'DEADLINE_WARNING' ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p
                                className={cn(
                                  'text-xs font-semibold leading-tight truncate',
                                  n.isRead ? 'text-slate-700' : 'text-slate-900',
                                )}
                              >
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {relativeTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-[#0c3978] hover:underline"
                    >
                      View full notifications center →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Role / Persona Switcher */}
            <div ref={personaRef} className="relative hidden md:block">
              <button
                onClick={() => {
                  setPersonaOpen(!personaOpen);
                  setNotifOpen(false);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                title="Switch Persona / Simulated Role"
              >
                <Shield className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Persona Switcher Dropdown */}
              {personaOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <UserCheck className="w-4 h-4 text-blue-700" />
                      <span>Switch Simulated Persona</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Change role to test tier permissions across AICTE bureaus.
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                    {DEMO_ACCOUNTS.map((acc) => {
                      const isCurrent = currentUser.role === acc.role;
                      return (
                        <button
                          key={acc.role}
                          onClick={() => {
                            switchPersona(acc.role as UserRole);
                            setPersonaOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group',
                            isCurrent
                              ? 'bg-blue-50/80 border border-blue-200'
                              : 'hover:bg-slate-50',
                          )}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900">
                                {acc.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0c3978] text-white">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {acc.label} • {acc.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Prominent Orange Pill Button */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setPersonaOpen(false);
                  setNotifOpen(false);
                }}
                className="px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0"
                aria-label="User Account"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Officer: </span>
                <span>{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 hidden sm:inline" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {ROLE_LABELS[currentUser.role] || currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Officer Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Portal Settings & Security
                    </button>
                    <button
                      onClick={() => {
                        navigate('/users');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Ombudsman & Officer Directory
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      Log Out / Switch Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Trigger Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 touch-manipulation"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Deep Royal Blue Navigation Bar (Desktop & Tablet) */}
      <nav className="bg-[#0c3978] border-b-2 border-amber-500 text-white shadow-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Main Navigation Links */}
          <div className="flex items-center overflow-x-auto">
            {navLinks.map((nav) => {
              const active = isCurrentActive(nav.path);
              return (
                <Link
                  key={nav.path}
                  to={nav.path}
                  className={cn(
                    'px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5',
                    active
                      ? 'bg-[#134380] border-amber-400 text-white font-bold'
                      : 'border-transparent text-blue-100 hover:bg-[#134380] hover:text-white',
                  )}
                >
                  <span>{nav.label}</span>
                  {nav.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">
                      {nav.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Track Status & New Grievance Buttons */}
          <div className="flex items-center gap-2 pl-4 shrink-0">
            <button
              onClick={() => setTrackModalOpen(true)}
              className="px-3 py-1 rounded-md text-xs font-bold text-amber-300 hover:text-white bg-blue-900/60 hover:bg-blue-900 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Grievance</span>
            </button>

            <Link
              to="/complaints/new"
              className="px-3 py-1 rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File Grievance</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. Comprehensive Mobile Navigation Slide Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white text-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-[#0c3978] text-white p-4 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-[#0c3978]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold leading-tight">AICTE SAMADHAN</h3>
                  <p className="text-[10px] text-blue-200">Ministry of Education, GoI</p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/80 transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Identity Card & Quick Switcher */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0c3978] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {initials(currentUser.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <span className="text-[10px] text-slate-500 block truncate">{currentUser.bureau?.name || 'Central Directorate'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobilePersonaDrawer(!mobilePersonaDrawer)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 flex items-center gap-1 shrink-0"
                >
                  <Shield className="w-3 h-3 text-purple-600" />
                  <span>Switch Role</span>
                </button>
              </div>

              {/* Mobile Role Switcher Expandable List */}
              {mobilePersonaDrawer && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 max-h-48 overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Choose Identity:
                  </span>
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      onClick={() => {
                        switchPersona(acc.role as UserRole);
                        setMobilePersonaDrawer(false);
                      }}
                      className={cn(
                        'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between',
                        currentUser.role === acc.role
                          ? 'bg-[#0c3978] text-white'
                          : 'hover:bg-slate-200/60 text-slate-700',
                      )}
                    >
                      <span className="truncate">{acc.name}</span>
                      <span className="text-[9px] opacity-75">{acc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-100 shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackModalOpen(true);
                }}
                className="py-2 px-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Search className="w-3.5 h-3.5 text-amber-700" />
                <span>Track Status</span>
              </button>

              <Link
                to="/complaints/new"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File Grievance</span>
              </Link>
            </div>

            {/* Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Portal Sections
              </span>
              {navLinks.map((nav) => {
                const active = isCurrentActive(nav.path);
                return (
                  <Link
                    key={nav.path}
                    to={nav.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      active
                        ? 'bg-blue-50 text-[#0c3978] font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <nav.icon className={cn('w-4 h-4', active ? 'text-[#0c3978]' : 'text-slate-400')} />
                      <span>{nav.label}</span>
                    </div>
                    {nav.badge ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">
                        {nav.badge}
                      </span>
                    ) : (
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Helpline & Statutory Contact Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
              <div className="text-xs space-y-1.5">
                <a
                  href="tel:1800112323"
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-700 font-semibold text-[11px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Toll-Free: 1800-11-2323</span>
                </a>
                <a
                  href="mailto:pgrc@aicte-india.org"
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-700 text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>pgrc@aicte-india.org</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Switch User / Login
                </button>
                <span className="text-slate-400">v3.2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
