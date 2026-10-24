import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, Badge, Button, Modal } from '@/components/ui';
import { OVERLAP_STATUS_LABELS, OVERLAP_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Link2,
  Sparkles,
  GitCompareArrows,
} from 'lucide-react';
import type { OverlapAlert, OverlapAlertStatus } from '@/types';

export function OverlapsPage() {
  const navigate = useNavigate();
  const { overlapAlerts, linkOverlap, dismissOverlap, acknowledgeOverlap } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<OverlapAlertStatus | 'ALL'>('ALL');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<OverlapAlert | null>(null);
  const [reviewAction, setReviewAction] = useState<'LINK' | 'DISMISS' | 'ACKNOWLEDGE'>('LINK');
  const [reviewNote, setReviewNote] = useState('');

  const pendingCount = overlapAlerts.filter((a) => a.status === 'PENDING').length;
  const linkedCount = overlapAlerts.filter((a) => a.status === 'LINKED').length;

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return overlapAlerts;
    return overlapAlerts.filter((a) => a.status === statusFilter);
  }, [overlapAlerts, statusFilter]);

  const handleOpenReview = (alert: OverlapAlert, action: 'LINK' | 'DISMISS' | 'ACKNOWLEDGE') => {
    setActiveAlert(alert);
    setReviewAction(action);
    setReviewNote(
      action === 'LINK'
        ? 'Cross-bureau correlation verified. Initiated joint coordination docket.'
        : action === 'DISMISS'
          ? 'Independent matters with distinct scope. No merger required.'
          : 'Acknowledged for parallel monitoring between bureaus.',
    );
    setReviewModalOpen(true);
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlert) return;

    if (reviewAction === 'LINK') {
      linkOverlap(activeAlert.id, reviewNote);
    } else if (reviewAction === 'DISMISS') {
      dismissOverlap(activeAlert.id, reviewNote);
    } else {
      acknowledgeOverlap(activeAlert.id, reviewNote);
    }

    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Overlap Detection Radar"
        subtitle="Algorithmic cross-bureau correlation engine preventing duplicate investigations and fragmented redressal"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Overlap Radar' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<GitCompareArrows className="w-4 h-4 text-blue-600" />}
              onClick={() => navigate('/coordination')}
            >
              Inter-Bureau Coordination Hub
            </Button>
          </div>
        }
      />

      {/* Advisory Alert Banner */}
      {pendingCount > 0 && (
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-amber-900">
              {pendingCount} Pending Cross-Bureau Overlap{pendingCount > 1 ? 's' : ''} Require Assessment
            </h4>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              Separate grievances have been lodged against the same technical institution across the
              Regulation Bureau (RB) and Public Grievance Redressal Cell (PGRC). Linking these prevents
              conflicting orders.
            </p>
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'ALL', label: `All Alerts (${overlapAlerts.length})` },
          { id: 'PENDING', label: `Pending Review (${pendingCount})` },
          { id: 'LINKED', label: `Linked Cases (${linkedCount})` },
          { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
          { id: 'DISMISSED', label: 'Dismissed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap',
              statusFilter === tab.id
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overlap Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card padding="lg">
            <div className="py-12 text-center text-xs text-slate-400">
              No overlap alerts found under the current filter selection.
            </div>
          </Card>
        ) : (
          filtered.map((alert) => (
            <Card key={alert.id} padding="none" className="overflow-hidden border-slate-200 shadow-sm">
              {/* Card Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60 gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2.5 rounded-xl shrink-0 shadow-2xs',
                      alert.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-700'
                        : alert.status === 'LINKED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 font-sans">
                        {Math.round(alert.similarityScore * 100)}% Cross-Bureau Correlation
                      </span>
                      <Badge className={OVERLAP_STATUS_COLORS[alert.status]} dot>
                        {OVERLAP_STATUS_LABELS[alert.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Institution: <span className="font-semibold text-slate-800">{alert.institution?.name}</span>
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {alert.status === 'PENDING' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        icon={<Link2 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenReview(alert, 'LINK')}
                      >
                        Link Cases
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenReview(alert, 'ACKNOWLEDGE')}
                      >
                        Acknowledge
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<X className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenReview(alert, 'DISMISS')}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                  {alert.status === 'LINKED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<GitCompareArrows className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/coordination')}
                    >
                      Joint Coordination Docket
                    </Button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
                {/* Complaint A */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Case A: {alert.complaintA?.trackingNumber}
                    </span>
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                      {alert.complaintA?.bureau} Bureau
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {alert.complaintA?.subject}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {alert.complaintA?.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Complainant: {alert.complaintA?.complainantName}</span>
                    <button
                      onClick={() => navigate(`/complaints/${alert.complaintAId}`)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Inspect Case →
                    </button>
                  </div>
                </div>

                {/* Complaint B */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Case B: {alert.complaintB?.trackingNumber}
                    </span>
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                      {alert.complaintB?.bureau} Bureau
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {alert.complaintB?.subject}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {alert.complaintB?.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Complainant: {alert.complaintB?.complainantName}</span>
                    <button
                      onClick={() => navigate(`/complaints/${alert.complaintBId}`)}
                      className="text-purple-600 font-semibold hover:underline"
                    >
                      Inspect Case →
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Factors & Similarity Score Bar */}
              <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                    Algorithmic Correlation Factors
                  </span>
                  <span className="text-slate-600 font-mono font-bold">
                    Confidence: {Math.round(alert.similarityScore * 100)}%
                  </span>
                </div>

                {/* Factors Chips */}
                <div className="flex flex-wrap gap-2">
                  {alert.matchReasons.map((reason, i) => (
                    <div
                      key={i}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border shadow-2xs',
                        reason.matched
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-100/60 border-slate-200 text-slate-400',
                      )}
                    >
                      {reason.matched ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{reason.factor}</span>
                      {reason.matched && reason.detail && (
                        <span className="text-emerald-950 font-semibold opacity-90">
                          ({reason.detail})
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Similarity Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      alert.similarityScore >= 0.75
                        ? 'bg-amber-500'
                        : alert.similarityScore >= 0.5
                          ? 'bg-blue-600'
                          : 'bg-slate-400',
                    )}
                    style={{ width: `${alert.similarityScore * 100}%` }}
                  />
                </div>

                {alert.reviewNote && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Officer Remark:</span>{' '}
                    {alert.reviewNote}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL: Review Overlap Alert */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={
          reviewAction === 'LINK'
            ? 'Link Cross-Bureau Grievances'
            : reviewAction === 'DISMISS'
              ? 'Dismiss Overlap Alert'
              : 'Acknowledge Overlap'
        }
        subtitle="Commit administrative determination to the audit log"
      >
        <form onSubmit={handleConfirmReview} className="space-y-4">
          <p className="text-xs text-slate-600">
            {reviewAction === 'LINK' &&
              'Linking these complaints will associate them into a unified Inter-Bureau Coordination Docket so both bureaus collaborate on findings.'}
            {reviewAction === 'DISMISS' &&
              'Dismissing this alert verifies that these grievances are separate and should proceed along distinct administrative tracks.'}
            {reviewAction === 'ACKNOWLEDGE' &&
              'Acknowledging keeps both cases active while notifying assigned officers of parallel inquiries.'}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Officer Review Assessment / Note *
            </label>
            <textarea
              required
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'DISMISS' ? 'danger' : 'primary'}
              type="submit"
              size="sm"
            >
              Confirm Determination
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
