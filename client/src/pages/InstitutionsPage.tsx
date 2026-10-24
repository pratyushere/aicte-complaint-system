import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Badge, Button, Card, DataTable, Modal, type Column } from '@/components/ui';
import {
  INSTITUTION_TYPE_LABELS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_COLORS,
} from '@/lib/constants';
import {
  Plus,
  Search,
  Download,
  MapPin,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import type { Institution, InstitutionType, ApprovalStatus } from '@/types';

export function InstitutionsPage() {
  const { institutions, complaints, addInstitution, addToast } = useAppStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InstitutionType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  // Add Institution Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [aicteId, setAicteId] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<InstitutionType>('ENGINEERING');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('APPROVED');

  const filtered = useMemo(() => {
    return institutions.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.aicteId.toLowerCase().includes(search.toLowerCase()) ||
        i.state.toLowerCase().includes(search.toLowerCase()) ||
        i.city.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'ALL' || i.type === typeFilter;
      const matchStatus = statusFilter === 'ALL' || i.approvalStatus === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [institutions, search, typeFilter, statusFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !aicteId || !state || !city) {
      addToast({
        title: 'Validation Error',
        message: 'Please complete all required fields.',
        type: 'error',
      });
      return;
    }

    addInstitution({
      name,
      aicteId,
      state,
      district: district || city,
      city,
      type,
      approvalStatus,
    });

    setAddModalOpen(false);
    setName('');
    setAicteId('');
    setState('');
    setDistrict('');
    setCity('');
  };

  const handleExportCSV = () => {
    const headers = ['AICTE ID', 'Institution Name', 'Type', 'Approval Status', 'City', 'State'];
    const rows = filtered.map((i) => [
      `"${i.aicteId}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.type}"`,
      `"${i.approvalStatus}"`,
      `"${i.city}"`,
      `"${i.state}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aicte-institutions-directory-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Directory Exported',
      message: `Downloaded ${filtered.length} institutions as CSV.`,
      type: 'success',
    });
  };

  const columns: Column<Institution>[] = [
    {
      key: 'aicteId',
      header: 'AICTE ID',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {r.aicteId}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Institution Name',
      className: 'max-w-xs',
      render: (r) => (
        <div>
          <span className="text-slate-900 font-semibold truncate block leading-snug">
            {r.name}
          </span>
          <span className="text-[11px] text-slate-400">
            {r.city}, {r.state}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Discipline',
      render: (r) => (
        <span className="text-slate-700 text-xs font-medium">
          {INSTITUTION_TYPE_LABELS[r.type]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statutory Approval',
      render: (r) => (
        <Badge className={APPROVAL_STATUS_COLORS[r.approvalStatus]} dot>
          {APPROVAL_STATUS_LABELS[r.approvalStatus]}
        </Badge>
      ),
    },
    {
      key: 'complaints',
      header: 'Grievance Profile',
      render: (r) => {
        const count = complaints.filter((c) => c.institutionId === r.id).length;
        return (
          <span
            className={
              count === 0
                ? 'text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200'
                : count > 1
                  ? 'text-xs font-semibold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200'
                  : 'text-xs font-semibold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200'
            }
          >
            {count} Case{count === 1 ? '' : 's'} on record
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Directory"
        subtitle={`Official registry of technical colleges, universities & polytechnics (${filtered.length} institutes indexed)`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Institutions' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('TABLE')}
                className={
                  viewMode === 'TABLE'
                    ? 'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 bg-white text-slate-900 shadow-xs'
                    : 'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 text-slate-500 hover:text-slate-900'
                }
                title="Table View"
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={
                  viewMode === 'GRID'
                    ? 'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 bg-white text-slate-900 shadow-xs'
                    : 'p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 text-slate-500 hover:text-slate-900'
                }
                title="Cards View"
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
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Institution
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, AICTE ID, state or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700"
            >
              <option value="ALL">All Disciplines</option>
              {Object.entries(INSTITUTION_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700"
            >
              <option value="ALL">All Approval Statuses</option>
              {Object.entries(APPROVAL_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Render View */}
      {viewMode === 'TABLE' ? (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => navigate(`/institutions/${r.id}`)}
          emptyMessage="No institutions match your search."
          emptySubtext="Try adjusting your search criteria or discipline filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inst) => {
            const count = complaints.filter((c) => c.institutionId === inst.id).length;
            return (
              <Card
                key={inst.id}
                hover
                padding="md"
                className="cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/institutions/${inst.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {inst.aicteId}
                    </span>
                    <Badge className={APPROVAL_STATUS_COLORS[inst.approvalStatus]} dot>
                      {APPROVAL_STATUS_LABELS[inst.approvalStatus]}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug mt-1">
                    {inst.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {inst.city}, {inst.state}
                    </span>
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">
                    {INSTITUTION_TYPE_LABELS[inst.type]}
                  </span>
                  <span
                    className={
                      count === 0
                        ? 'font-semibold text-xs px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'font-semibold text-xs px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200'
                    }
                  >
                    {count} Grievances
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL: Add Institution */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Institution"
        subtitle="Enroll institution record into the AICTE Central Registry"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Institution Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sardar Patel Institute of Technology"
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                AICTE Permanent ID *
              </label>
              <input
                type="text"
                required
                value={aicteId}
                onChange={(e) => setAicteId(e.target.value)}
                placeholder="AICTE-1-4501239999"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                Discipline Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstitutionType)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
              >
                {Object.entries(INSTITUTION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                State *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Statutory Approval Status *
            </label>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            >
              {Object.entries(APPROVAL_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Save Institution Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
