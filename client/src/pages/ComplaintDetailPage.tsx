import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import {
  PageHeader,
  Badge,
  Card,
  CardHeader,
  EmptyState,
  Button,
  Modal,
} from '@/components/ui';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  BUREAU_LABELS,
  OVERLAP_STATUS_COLORS,
  OVERLAP_STATUS_LABELS,
} from '@/lib/constants';
import { formatDate, daysUntil, cn } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  FileText,
  Shield,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Printer,
  UserCheck,
  Send,
  Lock,
} from 'lucide-react';
import type { ComplaintStatus } from '@/types';

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    complaints,
    timeline,
    remarks,
    overlapAlerts,
    updateComplaintStatus,
    reassignComplaint,
    addRemark,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TIMELINE' | 'OVERLAPS' | 'REMARKS'>('OVERVIEW');

  // Modals
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('UNDER_REVIEW');
  const [statusReason, setStatusReason] = useState('');

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [newAssignee, setNewAssignee] = useState('Priya Sharma');

  // New Remark form
  const [remarkText, setRemarkText] = useState('');
  const [isInternalRemark, setIsInternalRemark] = useState(false);

  const complaint = useMemo(
    () => complaints.find((c) => c.id === id || c.trackingNumber === id),
    [complaints, id],
  );

  if (!complaint) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Complaint Not Found"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Complaints', href: '/complaints' },
            { label: 'Not Found' },
          ]}
        />
        <EmptyState
          title="Grievance Record Not Found"
          description="The requested tracking ID or record does not exist in the active AICTE central repository."
          action={
            <Button variant="secondary" onClick={() => navigate('/complaints')}>
              Return to Registry
            </Button>
          }
        />
      </div>
    );
  }

  const days = complaint.deadline ? daysUntil(complaint.deadline) : null;
  const isOverdue = days !== null && days < 0;
  const isNear = days !== null && days <= 7 && days >= 0;

  const complaintTimeline = timeline[complaint.id] || [];
  const complaintRemarks = remarks[complaint.id] || [];

  // Associated overlap alerts
  const associatedOverlaps = overlapAlerts.filter(
    (oa) => oa.complaintAId === complaint.id || oa.complaintBId === complaint.id,
  );

  // Status progression lifecycle steps
  const statusFlow: ComplaintStatus[] = [
    'RECEIVED',
    'UNDER_REVIEW',
    'INVESTIGATION',
    'AWAITING_RESPONSE',
    'RESOLVED',
  ];

  const currentStatusIdx = statusFlow.indexOf(complaint.status);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(complaint.id, newStatus, statusReason);
    setStatusModalOpen(false);
    setStatusReason('');
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reassignComplaint(complaint.id, newAssignee);
    setReassignModalOpen(false);
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;
    addRemark(complaint.id, remarkText.trim(), isInternalRemark);
    setRemarkText('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Case Metadata */}
      <PageHeader
        title={complaint.trackingNumber}
        subtitle={complaint.subject}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Complaints', href: '/complaints' },
          { label: complaint.trackingNumber },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print Dossier
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<UserCheck className="w-4 h-4" />}
              onClick={() => setReassignModalOpen(true)}
            >
              Reassign Officer
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                setNewStatus(complaint.status);
                setStatusModalOpen(true);
              }}
            >
              Update Status
            </Button>
          </div>
        }
      />

      {/* Case Overview Summary Card */}
      <Card padding="md" className="border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {complaint.trackingNumber}
            </span>
            <Badge className={STATUS_COLORS[complaint.status]} dot pulse={complaint.status === 'ESCALATED'}>
              {STATUS_LABELS[complaint.status]}
            </Badge>
            <Badge className={PRIORITY_COLORS[complaint.priority]}>
              {PRIORITY_LABELS[complaint.priority]}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
              Bureau: {BUREAU_LABELS[complaint.bureau]}
            </Badge>
          </div>

          {/* SLA Countdown Chip */}
          <div className="flex items-center gap-3">
            {complaint.deadline && (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-2xs',
                  isOverdue
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : isNear
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200',
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isOverdue
                    ? `Overdue by ${Math.abs(days || 0)} Days`
                    : isNear
                      ? `${days} Days Remaining (SLA Alert)`
                      : `Deadline: ${formatDate(complaint.deadline)}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Statutory Redressal Progression
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusFlow.map((st, idx) => {
              const isPast = currentStatusIdx >= idx && currentStatusIdx !== -1;
              const isCurrent = complaint.status === st;

              return (
                <div
                  key={st}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between',
                    isCurrent
                      ? 'border-blue-600 bg-blue-50/70 shadow-2xs text-blue-900 font-bold'
                      : isPast
                        ? 'border-slate-200 bg-slate-50 text-slate-700 font-medium'
                        : 'border-slate-100 bg-white text-slate-400 opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold">0{idx + 1}</span>
                    {isPast && <span className="text-emerald-600 text-xs">✓</span>}
                  </div>
                  <span className="truncate">{STATUS_LABELS[st]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        {[
          { id: 'OVERVIEW', label: 'Case Dossier', icon: FileText },
          { id: 'TIMELINE', label: `Timeline (${complaintTimeline.length})`, icon: Clock },
          {
            id: 'OVERLAPS',
            label: `AI Overlaps (${associatedOverlaps.length})`,
            icon: Sparkles,
            badge: associatedOverlaps.length > 0,
          },
          { id: 'REMARKS', label: `Remarks (${complaintRemarks.length})`, icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'pb-3 px-3 sm:px-3.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 touch-manipulation',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Main Dossier (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <CardHeader subtitle="Recorded grievance statement and factual evidence">
                Grievance Narrative
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject Heading
                  </h4>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {complaint.subject}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Detailed Statement of Facts
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-line bg-slate-50/80 p-4 rounded-xl border border-slate-100 font-sans">
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Regulatory Clauses */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Statutory Regulations Pertaining to Case
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                    AICTE Act 1987 — Section 10(k)
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Approval Process Handbook (APH) 2024-25 Clause 4.2
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    Grievance Redressal Mechanism Regulations 2019
                  </span>
                </div>
              </div>
            </Card>

            {/* Complainant Profile */}
            <Card padding="lg">
              <CardHeader subtitle="Submitter identity and whistleblower status">
                Complainant Record
              </CardHeader>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-slate-400">Submitting Individual</dt>
                  <dd className="font-semibold text-slate-900 text-sm mt-0.5">
                    {complaint.complainantName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Registered Contact Channel</dt>
                  <dd className="font-semibold text-slate-900 text-sm mt-0.5 font-mono">
                    {complaint.complainantContact}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Filed On</dt>
                  <dd className="font-medium text-slate-700 mt-0.5">
                    {formatDate(complaint.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Identity Protection</dt>
                  <dd className="font-medium text-emerald-700 mt-0.5">
                    Protected Whistleblower Identity
                  </dd>
                </div>
              </dl>
            </Card>
          </div>

          {/* Right Sidebar: Institution Card & Responsible Officer */}
          <div className="space-y-6">
            {/* Institution Card */}
            {complaint.institution && (
              <Card padding="lg">
                <CardHeader
                  subtitle="Enrolled technical college"
                  action={
                    <Link
                      to={`/institutions/${complaint.institution.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  }
                >
                  Target Institution
                </CardHeader>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {complaint.institution.name}
                    </h4>
                    <p className="font-mono text-xs text-blue-700 mt-0.5">
                      {complaint.institution.aicteId}
                    </p>
                  </div>

                  <dl className="space-y-2 text-xs pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Discipline</dt>
                      <dd className="font-semibold text-slate-700">{complaint.institution.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Jurisdiction</dt>
                      <dd className="font-semibold text-slate-700">
                        {complaint.institution.city}, {complaint.institution.state}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">AICTE Approval</dt>
                      <dd>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {complaint.institution.approvalStatus}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card>
            )}

            {/* Officer Assignment Card */}
            <Card padding="lg">
              <CardHeader subtitle="Authorized case investigator">Assigned Officer</CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {complaint.assignedTo?.name ? complaint.assignedTo.name.charAt(0) : 'P'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {complaint.assignedTo?.name || 'Priya Sharma'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {BUREAU_LABELS[complaint.bureau]} Investigator
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Last reviewed:</span>
                <span className="font-medium text-slate-800">{formatDate(complaint.updatedAt)}</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: INVESTIGATION TIMELINE & AUDIT TRAIL */}
      {activeTab === 'TIMELINE' && (
        <Card padding="lg" className="animate-in fade-in duration-200">
          <CardHeader subtitle="Chronological audit record of official actions and stage transitions">
            Investigation Audit Trail
          </CardHeader>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaintTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node marker */}
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-xs" />

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Shield className="w-3 h-3 text-slate-400" />
                    <span>Action by: {item.actor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: AI OVERLAP RADAR */}
      {activeTab === 'OVERLAPS' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {associatedOverlaps.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={<Sparkles className="w-8 h-8 text-blue-600" />}
                title="No Inter-Bureau Overlaps Flagged"
                description="The AI Overlap Radar has analyzed cross-bureau databases and verified this case has no redundant duplicate inquiries."
              />
            </Card>
          ) : (
            associatedOverlaps.map((oa) => (
              <Card key={oa.id} padding="lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {Math.round(oa.similarityScore * 100)}% Cross-Bureau Similarity
                    </span>
                    <Badge className={OVERLAP_STATUS_COLORS[oa.status]} dot>
                      {OVERLAP_STATUS_LABELS[oa.status]}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/overlaps')}
                  >
                    Examine in Overlap Hub
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-mono text-xs text-blue-700 font-bold">
                      {oa.complaintA?.trackingNumber} ({oa.complaintA?.bureau})
                    </span>
                    <p className="text-xs font-semibold text-slate-900 mt-1">
                      {oa.complaintA?.subject}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-mono text-xs text-purple-700 font-bold">
                      {oa.complaintB?.trackingNumber} ({oa.complaintB?.bureau})
                    </span>
                    <p className="text-xs font-semibold text-slate-900 mt-1">
                      {oa.complaintB?.subject}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 4: OFFICER INVESTIGATION REMARKS */}
      {activeTab === 'REMARKS' && (
        <Card padding="lg" className="space-y-6 animate-in fade-in duration-200">
          <CardHeader subtitle="Official case log and confidential notes between investigating officers">
            Internal Investigation Remarks
          </CardHeader>

          {/* New Remark Form */}
          <form onSubmit={handleAddRemark} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Add Officer Note or Direct Inquiry Finding
              </label>
              <textarea
                required
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter investigation observation, inspection notice dispatch, or verification result..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternalRemark}
                  onChange={(e) => setIsInternalRemark(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Mark as Confidential Officer-Only Note
                </span>
              </label>

              <Button
                variant="primary"
                type="submit"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Log Remark
              </Button>
            </div>
          </form>

          {/* Remarks List */}
          <div className="space-y-3">
            {complaintRemarks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No investigation remarks recorded yet for this docket.
              </p>
            ) : (
              complaintRemarks.map((rem) => (
                <div
                  key={rem.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all text-xs',
                    rem.isInternal
                      ? 'border-purple-200 bg-purple-50/50'
                      : 'border-slate-200 bg-white shadow-2xs',
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rem.authorName}</span>
                      <span className="text-[10px] text-slate-500">
                        {rem.authorBureau} • {rem.authorRole}
                      </span>
                      {rem.isInternal && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                          CONFIDENTIAL
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(rem.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{rem.text}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* MODAL: Update Status */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Case Status"
        subtitle={`Transition statutory lifecycle for ${complaint.trackingNumber}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Target Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 font-medium text-slate-800"
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Regulatory Justification / Reason *
            </label>
            <textarea
              required
              rows={3}
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="e.g. Formal explanation received from College Registrar. Notice issued for compliance audit."
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Commit Status Change
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Reassign Officer */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Reassign Case Investigator"
        subtitle={`Allocate ${complaint.trackingNumber} to another authorized officer`}
      >
        <form onSubmit={handleReassignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Select Officer *
            </label>
            <select
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 font-medium text-slate-800"
            >
              <option value="Priya Sharma">Priya Sharma (Regulation Officer)</option>
              <option value="Amit Patel">Amit Patel (PGRC Officer)</option>
              <option value="Sunita Reddy">Sunita Reddy (Other Bureau Officer)</option>
              <option value="Vikram Singh">Vikram Singh (Western Region Officer)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setReassignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Save Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
