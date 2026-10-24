import { PageHeader, StatCard, Card, CardHeader, Badge } from '@/components/ui';
import { mockDashboardStats, mockComplaints, mockOverlapAlerts } from '@/lib/mock-data';
import {
  STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS,
  BUREAU_SHORT, OVERLAP_STATUS_COLORS, OVERLAP_STATUS_LABELS,
} from '@/lib/constants';
import { cn, formatDate, daysUntil } from '@/lib/utils';
import {
  FileText, AlertTriangle, CheckCircle2, Flame, Clock, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import type { ComplaintStatus, ComplaintPriority } from '@/types';
import { useNavigate } from 'react-router-dom';

const stats = mockDashboardStats;

const statusChartData = Object.entries(stats.complaintsByStatus).map(
  ([key, value]) => ({ name: STATUS_LABELS[key as ComplaintStatus], value }),
);

const priorityChartData = Object.entries(stats.complaintsByPriority).map(
  ([key, value]) => ({ name: PRIORITY_LABELS[key as ComplaintPriority], value }),
);

const pieColors = ['#b91c1c', '#d97706', '#2563eb', '#6b7280'];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of complaint activity — sample data for layout purposes"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Complaints" value={stats.totalComplaints} icon={FileText}
          change={{ value: 12, label: 'vs last month' }} />
        <StatCard label="Open" value={stats.openComplaints} icon={Clock}
          iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Resolved" value={stats.resolvedComplaints} icon={CheckCircle2}
          iconBg="bg-green-50" iconColor="text-green-600"
          change={{ value: 8, label: '' }} />
        <StatCard label="Critical" value={stats.criticalComplaints} icon={Flame}
          iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="Overlap Alerts" value={stats.pendingOverlaps} icon={AlertTriangle}
          iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Near Deadline" value={stats.approachingDeadlines} icon={TrendingUp}
          iconBg="bg-red-50" iconColor="text-red-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader>Complaint Trend (Sample Data)</CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.complaintsTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#243b53" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#243b53" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="count" stroke="#243b53" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader>By Priority</CardHeader>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value" stroke="none">
                  {priorityChartData.map((_e, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-1 justify-center">
            {priorityChartData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Status chart + Overlap alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader>By Status</CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false}
                  angle={-15} textAnchor="end" height={45} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#334e68" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader>Recent Overlap Alerts</CardHeader>
          <div className="space-y-3">
            {mockOverlapAlerts.map((alert) => (
              <div key={alert.id}
                onClick={() => navigate('/overlaps')}
                className="p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(alert.similarityScore * 100)}% Match
                  </span>
                  <Badge className={cn(OVERLAP_STATUS_COLORS[alert.status])}>
                    {OVERLAP_STATUS_LABELS[alert.status]}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {alert.complaintA?.trackingNumber} ↔ {alert.complaintB?.trackingNumber}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{alert.institution?.name}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card padding="none">
        <div className="px-5 pt-4 pb-2">
          <CardHeader>Recent Complaints (Sample Data)</CardHeader>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Bureau</th>
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockComplaints.slice(0, 5).map((c) => {
                const days = c.deadline ? daysUntil(c.deadline) : null;
                return (
                  <tr key={c.id} onClick={() => navigate(`/complaints/${c.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-2.5 font-mono text-xs text-navy-600">{c.trackingNumber}</td>
                    <td className="px-5 py-2.5 text-gray-900 max-w-xs truncate">{c.subject}</td>
                    <td className="px-5 py-2.5">
                      <Badge className="bg-gray-100 text-gray-600 border border-gray-200">{BUREAU_SHORT[c.bureau]}</Badge>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge className={PRIORITY_COLORS[c.priority]}>{PRIORITY_LABELS[c.priority]}</Badge>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge className={STATUS_COLORS[c.status]} dot>{STATUS_LABELS[c.status]}</Badge>
                    </td>
                    <td className="px-5 py-2.5 text-xs">
                      {c.deadline ? (
                        <span className={cn(days !== null && days <= 7 ? 'text-red-600 font-medium' : 'text-gray-500')}>
                          {formatDate(c.deadline)}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
