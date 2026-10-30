import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Badge, Card, CardHeader, EmptyState, Button } from '@/components/ui';
import {
  INSTITUTION_TYPE_LABELS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  BUREAU_SHORT,
} from '@/lib/constants';
import { formatDate, cn } from '@/lib/utils';
import {
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react';

export function InstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { institutions, complaints } = useAppStore();

  const institution = institutions.find((i) => i.id === id || i.aicteId === id);

  if (!institution) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Institution Not Found"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Institutions', href: '/institutions' },
            { label: 'Not Found' },
          ]}
        />
        <EmptyState
          title="Institution Record Not Found"
          description="The requested AICTE ID or institution profile does not exist in the active registry."
          action={
            <Button variant="secondary" onClick={() => navigate('/institutions')}>
              Return to Directory
            </Button>
          }
        />
      </div>
    );
  }

  const relatedComplaints = complaints.filter((c) => c.institutionId === institution.id);
  const openCount = relatedComplaints.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const resolvedCount = relatedComplaints.filter((c) => c.status === 'RESOLVED').length;
  const criticalCount = relatedComplaints.filter((c) => c.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={institution.name}
        subtitle={`Permanent AICTE ID: ${institution.aicteId} • ${institution.city}, ${institution.state}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Institutions', href: '/institutions' },
          { label: institution.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/complaints/new')}
            >
              File Grievance Against College
            </Button>
          </div>
        }
      />

      {/* KPI Stats Row for Institution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Grievances</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{relatedComplaints.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Lifetime complaints</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-amber-700 font-medium">Under Active Inquiry</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{openCount}</p>
          <span className="text-[11px] text-amber-600/80 mt-0.5 block">Pending resolution</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium">Redressed & Disposed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Closed satisfactorily</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-rose-700 font-medium">Critical Violations</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{criticalCount}</p>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">High urgency flags</span>
        </div>
      </div>

      {/* Institution Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="lg" className="lg:col-span-2">
          <CardHeader subtitle="Official regulatory accreditation and jurisdiction records">
            Statutory Accreditation & Profile
          </CardHeader>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Technical Discipline</dt>
              <dd className="text-slate-900 font-bold mt-1">
                {INSTITUTION_TYPE_LABELS[institution.type]}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Approval Status</dt>
              <dd className="mt-1">
                <Badge className={APPROVAL_STATUS_COLORS[institution.approvalStatus]} dot>
                  {APPROVAL_STATUS_LABELS[institution.approvalStatus]}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Campus Location
              </dt>
              <dd className="text-slate-800 font-medium mt-1">
                {institution.city}, {institution.district}, {institution.state}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Registry Date
              </dt>
              <dd className="text-slate-800 font-medium mt-1">
                {formatDate(institution.createdAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Regional Jurisdiction & Oversight Cell
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supervised under AICTE Western Regional Directorate. Annual Extension of Approval (EoA)
              contingent on resolution of outstanding Regulation Bureau inquiries.
            </p>
          </div>
        </Card>

        {/* Risk Assessment Card */}
        <Card padding="lg">
          <CardHeader subtitle="Composite risk evaluation">Compliance Risk Standing</CardHeader>
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Risk Assessment Tier</span>
              <span
                className={cn(
                  'font-bold px-2 py-0.5 rounded-full border text-[11px]',
                  relatedComplaints.length > 1
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                )}
              >
                {relatedComplaints.length > 1 ? 'ELEVATED RISK' : 'LOW RISK'}
              </span>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Calculated dynamically based on complaint frequency, approval violation ratio,
              and cross-bureau overlap recurrence.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Fee Disputes</span>
                <span className="font-semibold">
                  {relatedComplaints.filter((c) => c.category === 'FEE_DISPUTE').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Approval Breaches</span>
                <span className="font-semibold text-rose-600">
                  {relatedComplaints.filter((c) => c.category === 'APPROVAL_VIOLATION').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Faculty Ratio Norms</span>
                <span className="font-semibold">
                  {relatedComplaints.filter((c) => c.category === 'FACULTY').length}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Related Complaints Dossier Table */}
      <Card padding="none">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaints Filed Against This Institution</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical grievance dockets associated with AICTE ID {institution.aicteId}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {relatedComplaints.length} Record{relatedComplaints.length === 1 ? '' : 's'}
          </span>
        </div>

        {relatedComplaints.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No complaints recorded for this institution. The compliance record is clean.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Tracking #</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Bureau</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relatedComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/complaints/${c.id}`)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.trackingNumber}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 max-w-sm text-slate-900 font-medium truncate group-hover:text-blue-700 transition-colors">
                      {c.subject}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                        {BUREAU_SHORT[c.bureau]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className={PRIORITY_COLORS[c.priority]}>
                        {PRIORITY_LABELS[c.priority]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className={STATUS_COLORS[c.status]} dot>
                        {STATUS_LABELS[c.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
