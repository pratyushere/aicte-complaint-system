import { Bell, Search, ChevronDown } from 'lucide-react';
import { cn, initials } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const mockUser = { name: 'Priya Sharma', role: 'Admin', bureau: 'RB' };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints, institutions…"
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-md text-sm',
              'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20',
              'transition-colors',
            )}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 ml-4">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                <p className="text-xs text-gray-500">Notification center — not yet connected to backend</p>
              </div>
              <div className="py-8 text-center text-sm text-gray-400">
                Notifications will appear here once the backend is connected.
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-navy-800 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">{initials(mockUser.name)}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-gray-900 leading-tight">{mockUser.name}</p>
              <p className="text-[10px] text-gray-500 leading-tight">{mockUser.bureau} · {mockUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50 py-1">
              <p className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                Signed in as <span className="font-medium text-gray-700">{mockUser.name}</span>
              </p>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                Profile Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                Help & Support
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                  Sign Out (not implemented)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
