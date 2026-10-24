import { PageHeader, Badge, Button, DataTable, type Column } from '@/components/ui';
import { mockInstitutions } from '@/lib/mock-data';
import { INSTITUTION_TYPE_LABELS, APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Plus, Search, Download } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Institution } from '@/types';

export function InstitutionsPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = mockInstitutions.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.aicteId.toLowerCase().includes(search.toLowerCase()) ||
      i.state.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Institution>[] = [
    {
      key: 'aicteId',
      header: 'AICTE ID',
      render: (r) => <span className="font-mono text-xs text-navy-600">{r.aicteId}</span>,
    },
    {
      key: 'name',
      header: 'Institution Name',
      className: 'max-w-xs',
      render: (r) => <span className="text-gray-900 font-medium">{r.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <span className="text-gray-600 text-xs">{INSTITUTION_TYPE_LABELS[r.type]}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (r) => <span className="text-gray-600 text-xs">{r.city}, {r.state}</span>,
    },
    {
      key: 'status',
      header: 'Approval',
      render: (r) => (
        <Badge className={APPROVAL_STATUS_COLORS[r.approvalStatus]} dot>
          {APPROVAL_STATUS_LABELS[r.approvalStatus]}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Institution Directory"
        subtitle="AICTE-approved institutions — sample data"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Institutions' }]}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Institution</Button>
          </>
        }
      />

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, AICTE ID, or state…"
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-md text-sm',
              'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20',
            )}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        onRowClick={(r) => navigate(`/institutions/${r.id}`)}
        emptyMessage="No institutions match your search."
      />
    </div>
  );
}
