import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Badge, Button, Card, DataTable, type Column } from '@/components/ui';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  BUREAU_SHORT,
  CATEGORY_LABELS,
} from '@/lib/constants';
import { cn, formatDate, daysUntil } from '@/lib/utils';
import {
  Search,
  Plus,
  Download,
  LayoutList,
  Kanban,
  LayoutGrid,
  Clock,
} from 'lucide-react';
import type { Bureau, ComplaintStatus, ComplaintPriority, Complaint } from '@/types';

export function ComplaintsPage() {
  const { complaints, addToast } = useAppStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [bureau, setBureau] = useState<Bureau | 'ALL'>('ALL');
  const [status, setStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<ComplaintPriority | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN' | 'GRID'>('TABLE');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Filtered dataset
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.institution?.name.toLowerCase().includes(search.toLowerCase()) ||
        c.complainantName.toLowerCase().includes(search.toLowerCase());

      const matchBureau = bureau === 'ALL' || c.bureau === bureau;
      const matchStatus = status === 'ALL' || c.status === status;
      const matchPriority = priority === 'ALL' || c.priority === priority;

      let matchUrgent = true;
      if (urgentOnly) {
        if (!c.deadline || ['RESOLVED', 'CLOSED'].includes(c.status)) {
          matchUrgent = false;
        } else {
          const d = daysUntil(c.deadline);
          matchUrgent = d <= 7;
        }
      }

      return matchSearch && matchBureau && matchStatus && matchPriority && matchUrgent;
    });
  }, [complaints, search, bureau, status, priority, urgentOnly]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Tracking Number',
      'Bureau',
      'Category',
      'Priority',
      'Status',
      'Subject',
      'Institution',
      'AICTE ID',
      'Complainant',
      'Deadline',
      'Created Date',
    ];

    const rows = filtered.map((c) => [
      `"${c.trackingNumber}"`,
      `"${c.bureau}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.subject.replace(/"/g, '""')}"`,
      `"${(c.institution?.name || '').replace(/"/g, '""')}"`,
      `"${c.institution?.aicteId || ''}"`,
      `"${c.complainantName}"`,
      `"${c.deadline ? formatDate(c.deadline) : ''}"`,
      `"${formatDate(c.createdAt)}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aicte-complaints-registry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Registry Exported',
      message: `Downloaded ${filtered.length} records as CSV.`,
      type: 'success',
    });
  };

  // Columns for Table View
  const columns: Column<Complaint>[] = [
    {
      key: 'tracking',
      header: 'Tracking #',
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
          {r.trackingNumber}
        </span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Summary',
      className: 'max-w-xs',
      render: (r) => (
        <div>
          <span className="text-slate-900 font-medium truncate block leading-snug">
            {r.subject}
          </span>
          <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {r.description}
          </span>
        </div>
      ),
    },
    {
      key: 'institution',
      header: 'Institution & AICTE ID',
      className: 'max-w-[200px]',
      render: (r) => (
        <div>
          <span className="text-slate-800 text-xs font-medium truncate block">
            {r.institution?.name}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {r.institution?.aicteId}
          </span>
        </div>
      ),
    },
    {
      key: 'bureau',
      header: 'Bureau',
      render: (r) => (
        <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
          {BUREAU_SHORT[r.bureau]}
        </Badge>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (r) => (
        <span className="text-slate-600 text-xs font-medium">
          {CATEGORY_LABELS[r.category]}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (r) => (
        <Badge className={PRIORITY_COLORS[r.priority]}>
          {PRIORITY_LABELS[r.priority]}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge
          className={STATUS_COLORS[r.status]}
          dot
          pulse={r.status === 'ESCALATED' || r.priority === 'CRITICAL'}
        >
          {STATUS_LABELS[r.status]}
        </Badge>
      ),
    },
    {
      key: 'deadline',
      header: 'SLA Deadline',
      render: (r) => {
        if (!r.deadline) return <span className="text-slate-400">—</span>;
        const d = daysUntil(r.deadline);
        const isOverdue = d < 0;
        const isNear = d >= 0 && d <= 7;

        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Clock
              className={cn(
                'w-3.5 h-3.5',
                isOverdue
                  ? 'text-rose-600'
                  : isNear
                    ? 'text-amber-600'
                    : 'text-slate-400',
              )}
            />
            <span
              className={cn(
                isOverdue
                  ? 'text-rose-600 font-bold'
                  : isNear
                    ? 'text-amber-600 font-semibold'
                    : 'text-slate-600',
              )}
            >
              {formatDate(r.deadline)}
            </span>
          </div>
        );
      },
    },
  ];

  // Kanban status groups
  const kanbanColumns: { status: ComplaintStatus; label: string; color: string }[] = [
    { status: 'RECEIVED', label: 'Intake / Received', color: 'border-blue-400 bg-blue-50/50' },
    { status: 'UNDER_REVIEW', label: 'Under Review', color: 'border-amber-400 bg-amber-50/50' },
    { status: 'INVESTIGATION', label: 'Investigation Stage', color: 'border-indigo-400 bg-indigo-50/50' },
    { status: 'AWAITING_RESPONSE', label: 'Awaiting Response', color: 'border-orange-400 bg-orange-50/50' },
    { status: 'RESOLVED', label: 'Resolved / Disposed', color: 'border-emerald-400 bg-emerald-50/50' },
  ];

  const selectClass = cn(
    'px-3 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs',
    'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer transition-all',
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grievance Registry"
        subtitle={`Centralized repository of technical education complaints (${filtered.length} matching cases)`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Complaints' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('TABLE')}
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1',
                  viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900',
                )}
                title="Table View"
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('KANBAN')}
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1',
                  viewMode === 'KANBAN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900',
                )}
                title="Kanban Board"
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1',
                  viewMode === 'GRID' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900',
                )}
                title="Dossier Grid"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/complaints/new')}
            >
              Register Grievance
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <Card padding="md" className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking #, subject, institution, complainant..."
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400',
                'focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
              )}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={bureau}
              onChange={(e) => setBureau(e.target.value as any)}
              className={selectClass}
            >
              <option value="ALL">All Bureaus</option>
              <option value="RB">Regulation Bureau (RB)</option>
              <option value="PGRC">Public Grievance Cell (PGRC)</option>
              <option value="OTHER">Other Bureaus</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className={selectClass}
            >
              <option value="ALL">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className={selectClass}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* SLA Alert Checkbox Pill */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>≤ 7 Days SLA</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Render View Mode */}
      {viewMode === 'TABLE' && (
        <>
          {/* Mobile Card Dossier List (< md screens) */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                No complaints match your active filters.
              </div>
            ) : (
              filtered.map((c) => {
                const days = c.deadline ? daysUntil(c.deadline) : null;
                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/complaints/${c.id}`)}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-xs active:scale-[0.98] transition-all cursor-pointer space-y-2.5"
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
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {c.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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
              })
            )}
          </div>

          {/* Desktop Table View (>= md screens) */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filtered}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => navigate(`/complaints/${r.id}`)}
              emptyMessage="No complaints match your active filters."
              emptySubtext="Try adjusting your search criteria, clearing bureau or status filters."
            />
          </div>
        </>
      )}

      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const days = c.deadline ? daysUntil(c.deadline) : null;
            return (
              <Card
                key={c.id}
                hover
                padding="md"
                className="cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/complaints/${c.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.trackingNumber}
                    </span>
                    <Badge className={PRIORITY_COLORS[c.priority]}>
                      {PRIORITY_LABELS[c.priority]}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {c.subject}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="truncate max-w-[180px] font-medium">{c.institution?.name}</span>
                    <Badge className={STATUS_COLORS[c.status]} dot>
                      {STATUS_LABELS[c.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Bureau: {c.bureau}</span>
                    {c.deadline && (
                      <span className={cn(days !== null && days <= 7 ? 'text-rose-600 font-bold' : '')}>
                        Due: {formatDate(c.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colComplaints = filtered.filter((c) => c.status === col.status);
            return (
              <div key={col.status} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 min-w-[240px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                      {colComplaints.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {colComplaints.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200 bg-white/40">
                      No cases in this stage
                    </div>
                  ) : (
                    colComplaints.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/complaints/${c.id}`)}
                        className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {c.trackingNumber}
                          </span>
                          <span
                            className={cn(
                              'text-[9px] font-bold px-1.5 py-0.2 rounded',
                              c.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600',
                            )}
                          >
                            {c.priority}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {c.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          {c.institution?.name}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{BUREAU_SHORT[c.bureau]}</span>
                          {c.deadline && <span>{formatDate(c.deadline)}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
