import { useParams, Link } from 'react-router-dom';
import { PageHeader, Badge, Card, CardHeader, EmptyState, Button } from '@/components/ui';
import { mockComplaints } from '@/lib/mock-data';
import {
  STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS,
  BUREAU_LABELS, CATEGORY_LABELS,
} from '@/lib/constants';
import { formatDate, daysUntil, cn } from '@/lib/utils';
import { Clock, User, Building2, Tag, Calendar } from 'lucide-react';

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const complaint = mockComplaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div>
        <PageHeader title="Complaint Not Found"
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Complaints', href: '/complaints' }, { label: 'Not Found' }]} />
        <EmptyState title="Complaint not found" description="The requested complaint does not exist in the sample data." />
      </div>
    );
  }

  const days = complaint.deadline ? daysUntil(complaint.deadline) : null;

  return (
    <div>
      <PageHeader
        title={complaint.trackingNumber}
        subtitle={complaint.subject}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Complaints', href: '/complaints' },
          { label: complaint.trackingNumber },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm" disabled>
              Update Status (not implemented)
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Reassign (not implemented)
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Main Info */}
        <Card padding="lg" className="lg:col-span-2">
          <CardHeader>Complaint Details</CardHeader>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</dt>
              <dd className="text-gray-900 mt-0.5">{CATEGORY_LABELS[complaint.category]}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Bureau</dt>
              <dd className="text-gray-900 mt-0.5">{BUREAU_LABELS[complaint.bureau]}</dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> Institution</dt>
              <dd className="mt-0.5">
                <Link to={`/institutions/${complaint.institutionId}`} className="text-navy-600 hover:underline">
                  {complaint.institution?.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Filed</dt>
              <dd className="text-gray-900 mt-0.5">{formatDate(complaint.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> Complainant</dt>
              <dd className="text-gray-900 mt-0.5">{complaint.complainantName}</dd>
            </div>
            <div>
              <dt className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</dt>
              <dd className={cn('mt-0.5', days !== null && days <= 7 ? 'text-red-600 font-medium' : 'text-gray-900')}>
                {complaint.deadline ? formatDate(complaint.deadline) : '—'}
                {days !== null && days <= 7 && <span className="ml-1">({days}d remaining)</span>}
              </dd>
            </div>
          </dl>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
          </div>
        </Card>

        {/* Status Sidebar */}
        <div className="space-y-4">
          <Card padding="lg">
            <CardHeader>Status</CardHeader>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <Badge className={cn(STATUS_COLORS[complaint.status], 'text-sm')} dot>
                  {STATUS_LABELS[complaint.status]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                <Badge className={cn(PRIORITY_COLORS[complaint.priority], 'text-sm')}>
                  {PRIORITY_LABELS[complaint.priority]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(complaint.updatedAt)}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader>Timeline</CardHeader>
            <p className="text-sm text-gray-400">
              Complaint timeline will be displayed here once the backend is connected.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
