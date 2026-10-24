import { PageHeader, Card, Badge, Button } from '@/components/ui';
import { mockOverlapAlerts } from '@/lib/mock-data';
import { OVERLAP_STATUS_LABELS, OVERLAP_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, X, Link2, Eye } from 'lucide-react';

export function OverlapsPage() {
  const pending = mockOverlapAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <div>
      <PageHeader
        title="Overlap Detection"
        subtitle="Potentially related complaints across bureaus — sample alerts"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Overlap Detection' }]}
      />

      {/* Info banner */}
      {pending > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-md bg-amber-50 border border-amber-200 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{pending} pending alert{pending > 1 ? 's' : ''}</span> may benefit
            from coordinated handling. These are advisory — complaints are never automatically merged.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {mockOverlapAlerts.map((alert) => (
          <Card key={alert.id} padding="none">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-md', alert.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400')}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(alert.similarityScore * 100)}% Similarity
                    </span>
                    <Badge className={OVERLAP_STATUS_COLORS[alert.status]} dot>
                      {OVERLAP_STATUS_LABELS[alert.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.institution?.name}</p>
                </div>
              </div>
              {alert.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>Review</Button>
                  <Button variant="secondary" size="sm" icon={<Link2 className="w-3.5 h-3.5" />}>Link</Button>
                  <Button variant="ghost" size="sm" icon={<X className="w-3.5 h-3.5" />}>Dismiss</Button>
                </div>
              )}
            </div>

            {/* Side-by-side complaints */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {[alert.complaintA, alert.complaintB].map((c, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-navy-600">{c?.trackingNumber}</span>
                    <Badge className="bg-gray-100 text-gray-500 border border-gray-200">{c?.bureau}</Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{c?.subject}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{c?.description}</p>
                </div>
              ))}
            </div>

            {/* Match reasons */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Why these were flagged
              </p>
              <div className="flex flex-wrap gap-2">
                {alert.matchReasons.map((reason, i) => (
                  <div key={i} className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border',
                    reason.matched
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-400',
                  )}>
                    {reason.matched ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span className="font-medium">{reason.factor}</span>
                    {reason.matched && reason.detail && (
                      <span className="text-gray-500">— {reason.detail}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', alert.similarityScore >= 0.7 ? 'bg-amber-500' : 'bg-navy-500')}
                    style={{ width: `${alert.similarityScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 w-10 text-right">
                  {Math.round(alert.similarityScore * 100)}%
                </span>
              </div>

              {alert.reviewNote && (
                <div className="mt-3 px-3 py-2 rounded-md bg-white border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Review Note:</span> {alert.reviewNote}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
