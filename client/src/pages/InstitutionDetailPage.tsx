import { useParams, Link } from 'react-router-dom';
import { PageHeader, Badge, Card, CardHeader, EmptyState } from '@/components/ui';
import { mockInstitutions, mockComplaints } from '@/lib/mock-data';
import { INSTITUTION_TYPE_LABELS, APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS,
  STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, BUREAU_SHORT } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';

export function InstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const institution = mockInstitutions.find((i) => i.id === id);

  if (!institution) {
    return (
      <div>
        <PageHeader title="Institution Not Found"
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Institutions', href: '/institutions' }, { label: 'Not Found' }]} />
        <EmptyState title="Institution not found" description="The requested institution does not exist in the sample data." />
      </div>
    );
  }

  const relatedComplaints = mockComplaints.filter((c) => c.institutionId === institution.id);

  return (
    <div>
      <PageHeader
        title={institution.name}
        subtitle={`AICTE ID: ${institution.aicteId}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Institutions', href: '/institutions' },
          { label: institution.name },
        ]}
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card padding="lg" className="lg:col-span-2">
          <CardHeader>Institution Details</CardHeader>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-gray-500">Type</dt>
              <dd className="text-gray-900 font-medium mt-0.5">{INSTITUTION_TYPE_LABELS[institution.type]}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Approval Status</dt>
              <dd className="mt-0.5">
                <Badge className={APPROVAL_STATUS_COLORS[institution.approvalStatus]} dot>
                  {APPROVAL_STATUS_LABELS[institution.approvalStatus]}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</dt>
              <dd className="text-gray-900 mt-0.5">{institution.city}, {institution.district}, {institution.state}</dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Registered</dt>
              <dd className="text-gray-900 mt-0.5">{formatDate(institution.createdAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card padding="lg">
          <CardHeader>Summary</CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Complaints</span>
              <span className="text-lg font-semibold text-gray-900">{relatedComplaints.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Open</span>
              <span className="text-lg font-semibold text-amber-600">
                {relatedComplaints.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status)).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Resolved</span>
              <span className="text-lg font-semibold text-green-600">
                {relatedComplaints.filter((c) => c.status === 'RESOLVED').length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Related Complaints */}
      <Card padding="none">
        <div className="px-5 pt-4 pb-2">
          <CardHeader>Related Complaints</CardHeader>
        </div>
        {relatedComplaints.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No complaints registered for this institution.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Bureau</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {relatedComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5">
                      <Link to={`/complaints/${c.id}`} className="font-mono text-xs text-navy-600 hover:underline">
                        {c.trackingNumber}
                      </Link>
                    </td>
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
