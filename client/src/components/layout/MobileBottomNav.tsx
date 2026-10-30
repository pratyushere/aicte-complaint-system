import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { Home, Search, Plus, FileText, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const location = useLocation();
  const { setTrackModalOpen, mobileMenuOpen, setMobileMenuOpen, unreadNotificationCount, stats } =
    useAppStore();

  const isDashboard = location.pathname === '/dashboard';
  const isComplaints = location.pathname.startsWith('/complaints') && location.pathname !== '/complaints/new';

  const hasAlertBadge = unreadNotificationCount > 0 || stats.pendingOverlaps > 0;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))' }}
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-around h-15 px-2 max-w-md mx-auto">
        {/* 1. Dashboard */}
        <Link
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            'flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors active:scale-95 touch-manipulation',
            isDashboard ? 'text-[#0c3978]' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          <div className={cn('p-1 rounded-xl transition-colors', isDashboard && 'bg-blue-50')}>
            <Home className={cn('w-5 h-5', isDashboard ? 'text-[#0c3978] stroke-[2.4]' : 'text-slate-500')} />
          </div>
          <span>Dashboard</span>
        </Link>

        {/* 2. Instant Track Grievance Status Modal */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setTrackModalOpen(true);
          }}
          className="flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#0c3978] transition-colors active:scale-95 touch-manipulation cursor-pointer"
        >
          <div className="p-1 rounded-xl hover:bg-slate-50">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <span>Track</span>
        </button>

        {/* 3. Center Elevated Action: File Grievance */}
        <div className="flex flex-col items-center justify-center">
          <Link
            to="/complaints/new"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="File New Grievance"
            className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 ring-4 ring-white active:scale-90 transition-transform touch-manipulation"
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </Link>
          <span className="text-[10px] font-bold text-slate-700 mt-0.5">File</span>
        </div>

        {/* 4. Grievances Registry */}
        <Link
          to="/complaints"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            'flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors active:scale-95 touch-manipulation',
            isComplaints ? 'text-[#0c3978]' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          <div className={cn('p-1 rounded-xl transition-colors', isComplaints && 'bg-blue-50')}>
            <FileText
              className={cn('w-5 h-5', isComplaints ? 'text-[#0c3978] stroke-[2.4]' : 'text-slate-500')}
            />
          </div>
          <span>Registry</span>
        </Link>

        {/* 5. Menu Drawer */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn(
            'relative flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors active:scale-95 touch-manipulation cursor-pointer',
            mobileMenuOpen ? 'text-[#0c3978]' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          <div className={cn('p-1 rounded-xl transition-colors', mobileMenuOpen && 'bg-blue-50')}>
            <Menu className={cn('w-5 h-5', mobileMenuOpen ? 'text-[#0c3978]' : 'text-slate-500')} />
          </div>
          <span>Menu</span>

          {hasAlertBadge && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </nav>
  );
}
