import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { TrackGrievanceModal } from './TrackGrievanceModal';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer, CommandPalette } from '@/components/ui';

const CURRENT_YEAR = new Date().getFullYear();

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Official Government Header & Royal Blue Navigation Bar */}
      <Header />

      {/* 2. Main Portal Content Canvas */}
      <main className="flex-1 w-full pb-6 lg:pb-8">
        <Outlet />
      </main>

      {/* 3. Official Government Footer (Matching National Portal Norms) */}
      <footer className="border-t border-slate-200 bg-white text-xs text-slate-600 mt-auto shadow-inner">
        {/* Top footer row with advisory & compliance notes */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-slate-100">
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              AICTE SAMADHAN PORTAL
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unified National Grievance Redressal and Inter-Bureau Convergence Platform for Technical Institutions across India.
            </p>
          </div>

          <div className="space-y-1 text-[11px]">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Statutory Bureaus
            </h5>
            <p className="text-slate-600 hover:text-blue-700 cursor-pointer">Regulation Bureau (RB)</p>
            <p className="text-slate-600 hover:text-blue-700 cursor-pointer">Public Grievance Redressal Cell (PGRC)</p>
            <p className="text-slate-600 hover:text-blue-700 cursor-pointer">Approval Bureau (AB)</p>
            <p className="text-slate-600 hover:text-blue-700 cursor-pointer">Anti-Ragging Coordination Cell</p>
          </div>

          <div className="space-y-1 text-[11px]">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Citizen Support
            </h5>
            <p className="text-slate-600">Helpline: <strong className="text-slate-900">1800-11-2323</strong></p>
            <p className="text-slate-600">Desk: <strong className="text-slate-900">pgrc@aicte-india.org</strong></p>
            <p className="text-slate-600">Hours: Mon - Fri, 09:30 AM to 05:30 PM</p>
            <p className="text-slate-600">Address: Vasant Kunj, New Delhi - 110070</p>
          </div>

          <div className="space-y-2 text-[11px]">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              System Reliability
            </h5>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Redressal Mesh Operational</span>
            </div>
            <p className="text-[10px] text-slate-400">
              ISO 9001:2015 Compliant • AI-Assisted Cross Bureau Convergence Engine v3.2
            </p>
          </div>
        </div>

        {/* Bottom copyright & statutory strip (with pb-20 on mobile to not be obscured by fixed bottom nav) */}
        <div className="bg-slate-900 text-slate-400 py-3.5 px-4 sm:px-6 pb-20 lg:pb-3.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
            <p>
              © {CURRENT_YEAR} All India Council for Technical Education (AICTE), Ministry of Education, Government of India.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">Hyperlink Policy</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">NIC Hosted</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Overlays & Mobile Bottom Navigation */}
      <ToastContainer />
      <CommandPalette />
      <TrackGrievanceModal />
      <MobileBottomNav />
    </div>
  );
}
