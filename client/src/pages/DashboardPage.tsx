import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { StatCard, Card, CardHeader, Badge, Button } from '@/components/ui';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  BUREAU_SHORT,
  OVERLAP_STATUS_COLORS,
  OVERLAP_STATUS_LABELS,
} from '@/lib/constants';
import { cn, formatDate, daysUntil } from '@/lib/utils';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, complaints, overlapAlerts, currentUser } = useAppStore();
  const [tableFilter, setTableFilter] = useState<'ALL' | 'CRITICAL' | 'DEADLINE' | 'OPEN'>('ALL');

  // Chart data

  const priorityChartData = [
    { name: 'Critical', value: stats.complaintsByPriority.CRITICAL || 0, color: '#dc2626' },
    { name: 'High', value: stats.complaintsByPriority.HIGH || 0, color: '#d97706' },
    { name: 'Medium', value: stats.complaintsByPriority.MEDIUM || 0, color: '#2563eb' },
    { name: 'Low', value: stats.complaintsByPriority.LOW || 0, color: '#64748b' },
  ];

  const bureauBarData = [
    { name: 'Regulation Bureau', count: stats.complaintsByBureau.RB || 0, fill: '#1e3a8a' },
    { name: 'PGRC Cell', count: stats.complaintsByBureau.PGRC || 0, fill: '#059669' },
    { name: 'Other Cells', count: stats.complaintsByBureau.OTHER || 0, fill: '#d97706' },
  ];

  // Filtered recent complaints
  const filteredComplaints = complaints.filter((c) => {
    if (tableFilter === 'CRITICAL') return c.priority === 'CRITICAL';
    if (tableFilter === 'OPEN') return !['RESOLVED', 'CLOSED'].includes(c.status);
    if (tableFilter === 'DEADLINE') {
      if (!c.deadline || ['RESOLVED', 'CLOSED'].includes(c.status)) return false;
      const d = daysUntil(c.deadline);
      return d <= 7;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#1d3557] p-6 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>AICTE Executive Redressal & Institutional Oversight Mesh</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Operating as <span className="font-semibold text-white">{currentUser.role.replace(/_/g, ' ')}</span> in{' '}
              <span className="text-amber-300 font-medium">{currentUser.region}</span>. Review pending cross-bureau
              overlaps and ensure timely resolution within statutory SLA norms.
            </p>

            {/* Live Attention Ticker */}
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>
                <strong>{stats.criticalComplaints} Critical Cases</strong> and{' '}
                <strong>{stats.pendingOverlaps} Unresolved Overlap Alerts</strong> require priority assessment.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Button
              variant="saffron"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/complaints/new')}
            >
              Register Grievance
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
              onClick={() => navigate('/overlaps')}
              className="bg-white/95 hover:bg-white text-slate-900 border-none shadow-md"
            >
              Examine Overlaps ({stats.pendingOverlaps})
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          label="Total Registered"
          value={stats.totalComplaints}
          icon={FileText}
          change={{ value: 14, label: 'month-over-month' }}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => navigate('/complaints')}
        />
        <StatCard
          label="Under Review / Active"
          value={stats.openComplaints}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badge="In Progress"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200"
          onClick={() => {
            setTableFilter('OPEN');
          }}
        />
        <StatCard
          label="Resolved / Disposed"
          value={stats.resolvedComplaints}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          change={{ value: 9, label: 'velocity' }}
          onClick={() => navigate('/complaints')}
        />
        <StatCard
          label="Critical Priority"
          value={stats.criticalComplaints}
          icon={Flame}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          badge="Urgent SLA"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200 font-bold pulse-indicator"
          onClick={() => {
            setTableFilter('CRITICAL');
          }}
        />
        <StatCard
          label="AI Overlap Alerts"
          value={stats.pendingOverlaps}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badge="Radar Active"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200"
          onClick={() => navigate('/overlaps')}
        />
        <StatCard
          label="Near SLA Deadline"
          value={stats.approachingDeadlines}
          icon={TrendingUp}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          badge="≤ 7 Days"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200"
          onClick={() => {
            setTableFilter('DEADLINE');
          }}
        />
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Area Chart (Span 2) */}
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader
            subtitle="Historical monthly intake and resolution velocity"
            action={
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>Analytics Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            Grievance Inflow Velocity (6-Month Trend)
          </CardHeader>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.complaintsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#inflowGrad)"
                  name="Grievances Filed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Complaints Intake Volume</span>
            </div>
            <span>Average Redressal TAT: 12.4 Days</span>
          </div>
        </Card>

        {/* Priority Distribution Donut Chart */}
        <Card padding="lg">
          <CardHeader subtitle="Breakdown by urgency level">Grievance Priority Severity</CardHeader>
          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{stats.totalComplaints}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
            {priorityChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Status Breakdown + AI Overlap Radar Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bureau Distribution Bar Chart */}
        <Card padding="lg" className="lg:col-span-1">
          <CardHeader subtitle="Regulation Bureau vs. PGRC vs. Cells">Workload by Bureau</CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bureauBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#1e3a8a" name="Active Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cross-bureau coordination:</span>
            <span className="font-semibold text-emerald-700">92% Alignment</span>
          </div>
        </Card>

        {/* AI Overlap Radar Card (Span 2) */}
        <Card padding="lg" className="lg:col-span-2">
          <CardHeader
            subtitle="AI algorithmic similarity scan across multi-bureau filings"
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/overlaps')}
              >
                View All Alerts
              </Button>
            }
          >
            AI Cross-Bureau Overlap Radar
          </CardHeader>

          <div className="space-y-3">
            {overlapAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate('/overlaps')}
                className="group p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {Math.round(alert.similarityScore * 100)}% Similarity Score
                    </span>
                    <Badge className={OVERLAP_STATUS_COLORS[alert.status]} dot>
                      {OVERLAP_STATUS_LABELS[alert.status]}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium text-slate-500 truncate">
                    {alert.institution?.name}
                  </span>
                </div>

                {/* Compared Cases */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-100 mt-2">
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {alert.complaintA?.trackingNumber} ({alert.complaintA?.bureau})
                    </span>
                    <p className="text-slate-800 font-medium truncate mt-1">
                      {alert.complaintA?.subject}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                      {alert.complaintB?.trackingNumber} ({alert.complaintB?.bureau})
                    </span>
                    <p className="text-slate-800 font-medium truncate mt-1">
                      {alert.complaintB?.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                  <span className="truncate">
                    Matched: {alert.matchReasons.filter((r) => r.matched).map((r) => r.factor).join(' • ')}
                  </span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 shrink-0">
                    Review Docket <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Complaints Table Container */}
      <Card padding="none">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Grievance Stream</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live registered cases across technical institutions</p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'ALL', label: 'All Cases' },
                { id: 'CRITICAL', label: 'Critical' },
                { id: 'DEADLINE', label: 'Near Deadline' },
                { id: 'OPEN', label: 'Open' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTableFilter(filter.id)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer',
                  tableFilter === filter.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Cards View (< md screens) */}
        <div className="md:hidden p-3 space-y-2.5">
          {filteredComplaints.slice(0, 5).map((c) => {
            const days = c.deadline ? daysUntil(c.deadline) : null;
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/complaints/${c.id}`)}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-2xs active:scale-[0.98] transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {c.trackingNumber}
                  </span>
                  <Badge className={STATUS_COLORS[c.status]} dot>
                    {STATUS_LABELS[c.status]}
                  </Badge>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {c.subject}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {c.institution?.name}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                  <span className="font-semibold text-slate-700">{c.bureau} Bureau</span>
                  <div className="flex items-center gap-2">
                    {c.deadline && (
                      <span className={cn('text-[10px]', days !== null && days <= 7 ? 'text-rose-600 font-bold' : 'text-slate-400')}>
                        Due: {formatDate(c.deadline)}
                      </span>
                    )}
                    <Badge className={PRIORITY_COLORS[c.priority]}>
                      {PRIORITY_LABELS[c.priority]}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View (>= md screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking #</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject & Institution</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bureau</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.slice(0, 6).map((c) => {
                const days = c.deadline ? daysUntil(c.deadline) : null;
                const isOverdue = days !== null && days < 0;
                const isNearDeadline = days !== null && days <= 7 && days >= 0;

                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/complaints/${c.id}`)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 group-hover:border-blue-400 transition-colors">
                        {c.trackingNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3 max-w-sm">
                      <p className="text-slate-900 font-medium truncate group-hover:text-blue-700 transition-colors">
                        {c.subject}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.institution?.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                        {BUREAU_SHORT[c.bureau]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={PRIORITY_COLORS[c.priority]}>
                        {PRIORITY_LABELS[c.priority]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={STATUS_COLORS[c.status]} dot pulse={c.status === 'ESCALATED'}>
                        {STATUS_LABELS[c.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {c.deadline ? (
                        <div className="flex items-center gap-1.5">
                          <Clock
                            className={cn(
                              'w-3.5 h-3.5',
                              isOverdue
                                ? 'text-rose-600'
                                : isNearDeadline
                                  ? 'text-amber-600'
                                  : 'text-slate-400',
                            )}
                          />
                          <span
                            className={cn(
                              isOverdue
                                ? 'text-rose-600 font-bold'
                                : isNearDeadline
                                  ? 'text-amber-600 font-semibold'
                                  : 'text-slate-600',
                            )}
                          >
                            {formatDate(c.deadline)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {Math.min(6, filteredComplaints.length)} of {filteredComplaints.length} grievances</span>
          <button
            onClick={() => navigate('/complaints')}
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Access Full Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>
    </div>
  );
}
