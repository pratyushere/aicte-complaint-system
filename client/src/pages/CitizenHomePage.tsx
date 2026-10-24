import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import {
  FileText,
  Search,
  Building2,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Scale,
  BookOpen,
  PhoneCall,
  UserCheck,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function CitizenHomePage() {
  const navigate = useNavigate();
  const { stats, setTrackModalOpen } = useAppStore();

  const portalServices = [
    {
      id: 'reg-complaint',
      title: 'e-Grievance Registration',
      subtitle: '(Students / Faculty / Public)',
      icon: FileText,
      iconColor: 'text-blue-700',
      badge: 'Public Intake',
      action: () => navigate('/complaints/new'),
    },
    {
      id: 'track-status',
      title: 'Track Grievance Status',
      subtitle: 'Real-time Redressal Status',
      icon: Search,
      iconColor: 'text-indigo-700',
      badge: 'Live SLA Tracker',
      action: () => setTrackModalOpen(true),
    },
    {
      id: 'inst-approval',
      title: 'Institution Verification',
      subtitle: 'Check AICTE Approved Status',
      icon: Building2,
      iconColor: 'text-emerald-700',
      badge: '10,000+ Institutes',
      action: () => navigate('/institutions'),
    },
    {
      id: 'fee-dispute',
      title: 'Fee & Capitation Dispute Cell',
      subtitle: 'PGRC Redressal Mechanism',
      icon: Scale,
      iconColor: 'text-amber-700',
      badge: 'Fee Scrutiny',
      action: () => navigate('/complaints/new'),
    },
    {
      id: 'ragging-safety',
      title: 'Anti-Ragging Emergency Cell',
      subtitle: 'Confidential Whistleblower',
      icon: ShieldCheck,
      iconColor: 'text-rose-700',
      badge: 'Zero Tolerance',
      action: () => navigate('/complaints/new'),
    },
    {
      id: 'coordination-hub',
      title: 'Inter-Bureau Coordination',
      subtitle: 'Regulation Bureau & PGRC',
      icon: GraduationCap,
      iconColor: 'text-purple-700',
      badge: 'Cross-Bureau Mesh',
      action: () => navigate('/coordination'),
    },
  ];

  const publicInformation = [
    {
      id: 'approved-inst',
      title: 'Approved Institutions',
      subtitle: 'Technical Colleges Directory',
      icon: Building2,
      iconColor: 'text-blue-700',
      action: () => navigate('/institutions'),
    },
    {
      id: 'unapproved-inst',
      title: 'Unapproved / Defaulter List',
      subtitle: 'Revoked & Warning Notices',
      icon: AlertTriangle,
      iconColor: 'text-rose-700',
      action: () => navigate('/institutions'),
    },
    {
      id: 'aph-handbook',
      title: 'Approval Handbook (APH)',
      subtitle: 'Norms, Standards & Ratios',
      icon: BookOpen,
      iconColor: 'text-emerald-700',
      action: () => navigate('/reports'),
    },
    {
      id: 'redressal-regulations',
      title: 'Grievance Regulations',
      subtitle: 'Gazette Guidelines 2019',
      icon: Scale,
      iconColor: 'text-amber-700',
      action: () => navigate('/reports'),
    },
    {
      id: 'officer-directory',
      title: 'Ombudsman & Officers',
      subtitle: 'Regional Directorate Contacts',
      icon: UserCheck,
      iconColor: 'text-purple-700',
      action: () => navigate('/users'),
    },
    {
      id: 'analytics-digest',
      title: 'Public Statistics & Reports',
      subtitle: 'Resolution & SLA Compliance',
      icon: Info,
      iconColor: 'text-indigo-700',
      action: () => navigate('/reports'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
      {/* Real-time National Grievance Pulse Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Grievances
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {stats.totalComplaints}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Under Investigation
            </span>
            <span className="text-xl font-extrabold text-amber-700 font-mono">
              {stats.openComplaints}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Cross-Bureau Overlaps
            </span>
            <span className="text-xl font-extrabold text-purple-700 font-mono">
              {stats.pendingOverlaps}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Resolved Cases
            </span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">
              {stats.resolvedComplaints}
            </span>
          </div>
        </div>
      </div>

      {/* DUAL SERVICE BLOCKS: PORTAL SERVICES & PUBLIC INFORMATION (Matching Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: PORTAL SERVICES */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          {/* Blue Banner Header */}
          <div className="bg-[#134380] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase font-sans">
                PORTAL SERVICES
              </h2>
            </div>
            <span className="text-[11px] text-blue-200">Online Redressal Facilities</span>
          </div>

          {/* Grid of Service Action Tiles */}
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5 flex-1">
            {portalServices.map((svc) => (
              <div
                key={svc.id}
                onClick={svc.action}
                className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/40 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-100/60 flex items-center justify-center mb-2.5 transition-colors border border-slate-100 shadow-2xs">
                  <svc.icon className={cn('w-6 h-6', svc.iconColor)} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-900 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  {svc.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: PUBLIC INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          {/* Blue Banner Header */}
          <div className="bg-[#134380] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase font-sans">
                PUBLIC INFORMATION
              </h2>
            </div>
            <span className="text-[11px] text-blue-200">Statutory Norms & Data</span>
          </div>

          {/* Grid of Information Action Tiles */}
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5 flex-1">
            {publicInformation.map((info) => (
              <div
                key={info.id}
                onClick={info.action}
                className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/40 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-emerald-100/60 flex items-center justify-center mb-2.5 transition-colors border border-slate-100 shadow-2xs">
                  <info.icon className={cn('w-6 h-6', info.iconColor)} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-emerald-900 transition-colors">
                  {info.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LATEST NEWS TICKER STRIP (Matching Screenshot) */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-2.5 flex items-center gap-3 overflow-hidden shadow-2xs">
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0c3978] text-white shrink-0 shadow-xs">
          LATEST NEWS
        </span>
        <div className="text-xs text-slate-700 font-medium truncate flex-1 flex items-center gap-6">
          <span>
            ⚡ <strong>Public Notice:</strong> Technical institutions must display approved fee structures and AICTE Approval Letter prominently on their portals.
          </span>
          <span className="text-slate-400">•</span>
          <span>
            ⚡ <strong>Anti-Ragging Compliance:</strong> Zero tolerance policy enforced nationwide. File confidential reports directly through the portal.
          </span>
          <span className="text-slate-400">•</span>
          <span>
            ⚡ <strong>Multi-Bureau Mesh:</strong> Cross-bureau overlap detection engine operational to prevent conflicting orders between RB and PGRC.
          </span>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN SECTION (CONTACT US, SHOWCASE BANNER, MOBILE APP CARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Contact Us Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-[#0c3978] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-[#0c3978]" />
            CONTACT US
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                CENTRAL HEADQUARTERS
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                All India Council for Technical Education (AICTE),
                Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                TOLL FREE HELPLINE
              </span>
              <p className="text-sm font-extrabold text-[#0c3978] font-mono mt-0.5">
                1800-11-2323 / 011-29581000
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                OFFICIAL GRIEVANCE DESK
              </span>
              <p className="text-slate-600 font-mono text-[11px]">
                pgrc@aicte-india.org • complaints@aicte-india.org
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Working Hours: 09:30 AM – 05:30 PM</span>
              <span className="text-emerald-700 font-semibold">Mon – Fri</span>
            </div>
          </div>
        </div>

        {/* Card 2: Transparent Governance Showcase Banner */}
        <div className="bg-gradient-to-br from-[#0c3978] to-[#134380] rounded-xl text-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10">
              Transparent Governance
            </span>
            <h3 className="text-base sm:text-lg font-bold leading-snug">
              National Grievance Monitoring System
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Empowering over 3 Million students and faculty across 10,000+ approved institutions
              with prompt, transparent, and technology-driven grievance redressal.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex items-center justify-between text-xs border-t border-white/10 mt-4">
            <div>
              <span className="font-mono text-base font-bold text-white block">
                {stats.resolvedComplaints}
              </span>
              <span className="text-[10px] text-blue-200">Resolved Cases</span>
            </div>
            <div>
              <span className="font-mono text-base font-bold text-emerald-300 block">
                12.4 Days
              </span>
              <span className="text-[10px] text-blue-200">Average TAT</span>
            </div>
            <button
              onClick={() => navigate('/complaints')}
              className="px-3 py-1.5 rounded-lg bg-white text-[#0c3978] font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Mobile App Card (Matching KSP APP in screenshot) */}
        <div className="bg-slate-900 rounded-xl text-white p-5 shadow-sm flex flex-col justify-between border border-slate-800 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">AICTE VIGIL APP</h3>
                <p className="text-[10px] text-slate-400">Official Mobile Redressal App</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              File complaints, track status, and receive real-time notifications directly on your mobile device.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Available on Android & iOS</span>
              <span className="text-amber-400 font-semibold">Free Download</span>
            </div>
            <button
              onClick={() => setTrackModalOpen(true)}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer text-center block"
            >
              Track on Web / Mobile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
