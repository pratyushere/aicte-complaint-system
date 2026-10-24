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
} from 'lucide-react';
import { cn, relativeTime } from '@/lib/utils';
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
  } = useAppStore();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const filteredNotifs = notifications.filter((n) => {
    if (notifTab === 'UNREAD') return !n.isRead;
    if (notifTab === 'OVERLAPS') return n.type === 'OVERLAP_DETECTED';
    return true;
  });

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Register Grievance', path: '/complaints/new' },
    { label: 'Grievance Registry', path: '/complaints' },
    { label: 'Institutions', path: '/institutions' },
    { label: 'AI Overlap Radar', path: '/overlaps' },
    { label: 'Coordination Hub', path: '/coordination' },
    { label: 'Officer Dashboard', path: '/dashboard' },
    { label: 'Reports & SLA', path: '/reports' },
    { label: 'Ombudsman & Officers', path: '/users' },
    { label: 'Help & Settings', path: '/settings' },
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Official Government Branding Header (White Background, matching Karnataka Police / CCTNS Reference) */}
      <div className="bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
          {/* Left: AICTE Circular Emblem + Bilingual Portal Title */}
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            {/* National AICTE Emblem Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-[#0c3978] p-0.5 shrink-0 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#0c3978]" />
              </div>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-600 block leading-tight">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Ministry of Education
              </span>
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#0c3978] tracking-tight leading-tight group-hover:text-blue-800 transition-colors">
                AICTE Citizen Centric & Grievance Redressal Portal
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block leading-tight">
                Government of India • Unified Redressal Mechanism & Multi-Bureau Coordination
              </p>
            </div>
          </Link>

          {/* Right Header: Ashoka Insignia + SAMADHAN Badge + Switcher + Orange Pill Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* National Emblem Badge (Ashoka Lion Capital representation) */}
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

            {/* Global Search Shortcut (⌘K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer"
              title="Search Portal (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium hidden md:inline">Quick Search</span>
              <kbd className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 font-bold">
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
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                aria-label="View notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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

            {/* Interactive Role / Persona Switcher */}
            <div ref={personaRef} className="relative">
              <button
                onClick={() => {
                  setPersonaOpen(!personaOpen);
                  setNotifOpen(false);
                  setProfileOpen(false);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                title="Switch Persona / Simulated Role"
              >
                <Shield className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {currentUser.name}
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

            {/* Prominent Orange Pill Button (Matching Karnataka Police / CCTNS Screenshot) */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setPersonaOpen(false);
                  setNotifOpen(false);
                }}
                className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{currentUser.name ? `Officer: ${currentUser.name.split(' ')[0]}` : 'LOGIN'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Deep Royal Blue Navigation Bar (Matching Karnataka Police Reference #0c3978 + Amber Bottom Border) */}
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
                    'px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2',
                    active
                      ? 'bg-[#134380] border-amber-400 text-white font-bold'
                      : 'border-transparent text-blue-100 hover:bg-[#134380] hover:text-white',
                  )}
                >
                  {nav.label}
                </Link>
              );
            })}
          </div>

          {/* Nav Bar Action: Quick Track Status & New Grievance */}
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

      {/* Mobile Drawer (Expandable for small screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c3978] border-b-2 border-amber-500 text-white p-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-800">
            <button
              onClick={() => {
                setTrackModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-amber-300 bg-blue-900/80 border border-amber-500/40 flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Grievance Status</span>
            </button>
            <Link
              to="/complaints/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File Grievance</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
            {navLinks.map((nav) => {
              const active = isCurrentActive(nav.path);
              return (
                <Link
                  key={nav.path}
                  to={nav.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                    active
                      ? 'bg-[#134380] text-amber-300 font-bold'
                      : 'text-blue-100 hover:bg-[#134380] hover:text-white',
                  )}
                >
                  {nav.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
