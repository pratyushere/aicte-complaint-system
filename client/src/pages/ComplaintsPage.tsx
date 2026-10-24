import { PageHeader, Badge, Button, DataTable, type Column } from '@/components/ui';
import { mockComplaints } from '@/lib/mock-data';
import {
  STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS,
  BUREAU_SHORT, CATEGORY_LABELS,
} from '@/lib/constants';
import { cn, formatDate, daysUntil } from '@/lib/utils';
import { Search, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bureau, ComplaintStatus, Complaint } from '@/types';

export function ComplaintsPage() {
  const [search, setSearch] = useState('');
  const [bureau, setBureau] = useState<Bureau | 'ALL'>('ALL');
  const [status, setStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  const filtered = mockComplaints.filter((c) => {
    const matchSearch =
      c.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.institution?.name.toLowerCase().includes(search.toLowerCase());
    const matchBureau = bureau === 'ALL' || c.bureau === bureau;
    const matchStatus = status === 'ALL' || c.status === status;
    return matchSearch && matchBureau && matchStatus;
  });

  const columns: Column<Complaint>[] = [
    {
      key: 'tracking',
      header: 'Tracking #',
      render: (r) => <span className="font-mono text-xs text-navy-600">{r.trackingNumber}</span>,
    },
    {
      key: 'subject',
      header: 'Subject',
      className: 'max-w-[240px]',
      render: (r) => <span className="text-gray-900 truncate block">{r.subject}</span>,
    },
    {
      key: 'institution',
      header: 'Institution',
      className: 'max-w-[180px]',
      render: (r) => <span className="text-gray-600 text-xs truncate block">{r.institution?.name}</span>,
    },
    {
      key: 'bureau',
      header: 'Bureau',
      render: (r) => <Badge className="bg-gray-100 text-gray-600 border border-gray-200">{BUREAU_SHORT[r.bureau]}</Badge>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (r) => <span className="text-gray-600 text-xs">{CATEGORY_LABELS[r.category]}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (r) => <Badge className={PRIORITY_COLORS[r.priority]}>{PRIORITY_LABELS[r.priority]}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge className={STATUS_COLORS[r.status]} dot>{STATUS_LABELS[r.status]}</Badge>,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (r) => {
        if (!r.deadline) return <span className="text-gray-400">—</span>;
        const d = daysUntil(r.deadline);
        return (
          <span className={cn('text-xs', d <= 7 ? 'text-red-600 font-medium' : 'text-gray-500')}>
            {formatDate(r.deadline)}
          </span>
        );
      },
    },
  ];

  const selectClass = cn(
    'px-3 py-2 rounded-md text-sm bg-white border border-gray-200 text-gray-700',
    'focus:outline-none focus:border-navy-400 cursor-pointer',
  );

  return (
    <div>
      <PageHeader
        title="Complaint Registry"
        subtitle="All registered complaints — sample data"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Complaints' }]}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button size="sm" icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/complaints/new')}>
              Register Complaint
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking #, subject, institution…"
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-md text-sm',
              'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20',
            )} />
        </div>
        <select value={bureau} onChange={(e) => setBureau(e.target.value as Bureau | 'ALL')} className={selectClass}>
          <option value="ALL">All Bureaus</option>
          <option value="RB">Regulation Bureau</option>
          <option value="PGRC">PGRC</option>
          <option value="OTHER">Other</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus | 'ALL')} className={selectClass}>
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        onRowClick={(r) => navigate(`/complaints/${r.id}`)}
        emptyMessage="No complaints match your filters."
      />
    </div>
  );
}
