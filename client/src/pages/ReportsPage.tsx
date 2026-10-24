import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, CardHeader, Badge, Button } from '@/components/ui';
import {
  Download,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const { stats, addToast } = useAppStore();
  const [timeframe, setTimeframe] = useState<'30D' | 'Q3' | 'FY24' | 'ALL'>('Q3');

  const categoryChartData = [
    { name: 'Approval Violations', count: 48, fill: '#1e3a8a' },
    { name: 'Fee Disputes', count: 35, fill: '#059669' },
    { name: 'Faculty Norms', count: 28, fill: '#d97706' },
    { name: 'Infrastructure Deficits', count: 22, fill: '#7c3aed' },
    { name: 'Ragging Cases', count: 14, fill: '#dc2626' },
  ];

  const resolutionTrendData = [
    { month: 'May', received: 28, resolved: 22 },
    { month: 'Jun', received: 35, resolved: 31 },
    { month: 'Jul', received: 42, resolved: 38 },
    { month: 'Aug', received: 38, resolved: 36 },
    { month: 'Sep', received: 51, resolved: 44 },
    { month: 'Oct', received: 54, resolved: 49 },
  ];

  const bureauPerformance = [
    {
      bureau: 'Regulation Bureau (RB)',
      total: stats.complaintsByBureau.RB || 142,
      resolved: 118,
      rate: '83.1%',
      avgDays: 14.2,
      slaCompliance: '91.4%',
      status: 'OPTIMAL',
    },
    {
      bureau: 'Public Grievance Redressal Cell (PGRC)',
      total: stats.complaintsByBureau.PGRC || 89,
      resolved: 82,
      rate: '92.1%',
      avgDays: 8.6,
      slaCompliance: '96.8%',
      status: 'HIGH PERFORMING',
    },
    {
      bureau: 'Other Specialized Cells & Regional',
      total: stats.complaintsByBureau.OTHER || 17,
      resolved: 13,
      rate: '76.4%',
      avgDays: 18.0,
      slaCompliance: '88.2%',
      status: 'ADEQUATE',
    },
  ];

  const stateRankings = [
    { state: 'Maharashtra', count: 58, approved: 1420, riskScore: 'Moderate' },
    { state: 'Tamil Nadu', count: 44, approved: 1280, riskScore: 'Low' },
    { state: 'Karnataka', count: 39, approved: 1110, riskScore: 'Low' },
    { state: 'Delhi NCR', count: 36, approved: 640, riskScore: 'Moderate' },
    { state: 'Uttar Pradesh', count: 31, approved: 1350, riskScore: 'Moderate' },
    { state: 'Rajasthan', count: 24, approved: 580, riskScore: 'Low' },
  ];

  const handleExportBriefing = () => {
    addToast({
      title: 'Audit Report Generated',
      message: 'Executive performance briefing dossier downloaded.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Audits & Performance Intelligence"
        subtitle="Comprehensive cross-bureau analytics, resolution velocity metrics, and compliance oversight reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Reports & Audits' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Timeframe pill selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              {(
                [
                  { id: '30D', label: 'Last 30D' },
                  { id: 'Q3', label: 'Q3 2024' },
                  { id: 'FY24', label: 'FY 24-25' },
                  { id: 'ALL', label: 'All-Time' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                    timeframe === t.id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportBriefing}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* High-Impact Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Overall Redressal Rate
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 font-sans">86.2%</p>
          <span className="text-xs text-slate-500 block">+4.8% vs statutory target</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Average Turnaround Time (TAT)
          </span>
          <p className="text-3xl font-extrabold text-blue-600 font-sans">11.8 Days</p>
          <span className="text-xs text-slate-500 block">Norm: 30 statutory days</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            SLA Compliance Fidelity
          </span>
          <p className="text-3xl font-extrabold text-indigo-600 font-sans">93.4%</p>
          <span className="text-xs text-slate-500 block">Cases resolved within window</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Cross-Bureau Overlap Prevention
          </span>
          <p className="text-3xl font-extrabold text-amber-600 font-sans">100%</p>
          <span className="text-xs text-slate-500 block">Zero conflicting determinations</span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflow vs Resolution Comparison */}
        <Card padding="lg">
          <CardHeader subtitle="Monthly complaint inflow vs redressed disposal">
            Inflow vs. Resolution Velocity
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                <Line
                  type="monotone"
                  dataKey="received"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  name="Grievances Filed"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  name="Cases Resolved"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Intake Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Resolved Volume</span>
            </div>
          </div>
        </Card>

        {/* Complaints by Category Chart */}
        <Card padding="lg">
          <CardHeader subtitle="Grievance breakdown across regulatory domains">
            Grievances by Category
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#2563eb" name="Cases Filed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bureau Performance Comparison Matrix */}
      <Card padding="none">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bureau Redressal Performance Scorecard</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Efficiency and statutory SLA benchmark audit per operational bureau
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Operational Unit</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total Intake</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Disposed</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Resolution %</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Redressal TAT</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">SLA Compliance</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Audit Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bureauPerformance.map((b) => (
                <tr key={b.bureau} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{b.bureau}</td>
                  <td className="px-6 py-3.5 font-mono text-xs">{b.total}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-emerald-600 font-semibold">{b.resolved}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{b.rate}</td>
                  <td className="px-6 py-3.5 font-mono text-xs">{b.avgDays} Days</td>
                  <td className="px-6 py-3.5 font-semibold text-blue-700">{b.slaCompliance}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* State-Wise Grievance Distribution */}
      <Card padding="none">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Geographic Jurisdiction Frequency</h3>
          <p className="text-xs text-slate-500 mt-0.5">State-level concentration of technical education complaints</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">State / Territory</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Active Complaints</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Approved Institutes</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Complaints per 100 Inst.</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Regional Risk Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stateRankings.map((s) => (
                <tr key={s.state} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-semibold text-slate-900">{s.state}</td>
                  <td className="px-6 py-3 font-mono text-xs">{s.count}</td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">{s.approved}</td>
                  <td className="px-6 py-3 font-mono text-xs">
                    {((s.count / s.approved) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      className={
                        s.riskScore === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }
                      dot
                    >
                      {s.riskScore}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
