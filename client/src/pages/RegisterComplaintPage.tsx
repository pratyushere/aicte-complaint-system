import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, CardHeader, Button, Badge } from '@/components/ui';
import {
  CATEGORY_LABELS,
  BUREAU_LABELS,
  PRIORITY_COLORS,
} from '@/lib/constants';
import {
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Printer,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Bureau, ComplaintCategory, ComplaintPriority, Complaint } from '@/types';

export function RegisterComplaintPage() {
  const navigate = useNavigate();
  const { institutions, complaints, addComplaint, addToast } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [bureau, setBureau] = useState<Bureau>('RB');
  const [category, setCategory] = useState<ComplaintCategory>('APPROVAL_VIOLATION');
  const [priority, setPriority] = useState<ComplaintPriority>('HIGH');
  const [institutionId, setInstitutionId] = useState<string>(institutions[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [filesAttached, setFilesAttached] = useState<string[]>([]);

  // Selected institution details
  const selectedInstitution = useMemo(
    () => institutions.find((i) => i.id === institutionId),
    [institutions, institutionId],
  );

  // Real-time AI Duplicate & Overlap Detection for selected institution
  const existingGrievancesForInst = useMemo(() => {
    if (!institutionId) return [];
    return complaints.filter((c) => c.institutionId === institutionId);
  }, [complaints, institutionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !institutionId) {
      addToast({
        title: 'Validation Error',
        message: 'Please complete all required fields.',
        type: 'error',
      });
      return;
    }

    const complaint = addComplaint({
      institutionId,
      bureau,
      category,
      priority,
      subject,
      description,
      complainantName: isAnonymous ? 'Confidential Whistleblower' : complainantName || 'Anonymous',
      complainantContact: isAnonymous ? 'Protected under Whistleblower Act' : complainantContact || 'N/A',
      deadline: deadline || undefined,
    });

    setCreatedComplaint(complaint);
  };

  const copyTrackingNumber = () => {
    if (createdComplaint) {
      navigator.clipboard.writeText(createdComplaint.trackingNumber);
      addToast({
        title: 'Tracking ID Copied',
        message: `${createdComplaint.trackingNumber} copied to clipboard.`,
        type: 'info',
      });
    }
  };

  // If submitted, show the official Case Registration Receipt
  if (createdComplaint) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Grievance Registered Successfully"
          subtitle="Statutory intake recorded and indexed in AICTE Central Repository"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Complaints', href: '/complaints' },
            { label: 'Registration Receipt' },
          ]}
        />

        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Receipt Header Banner */}
          <div className="bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white p-6 sm:p-8 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Case Docket Open</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans">
                Official Intake Acknowledgement
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                All India Council for Technical Education • Nelson Mandela Marg, New Delhi
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">Tracking Identifier</span>
              <span className="font-mono text-xl font-bold text-amber-300">
                {createdComplaint.trackingNumber}
              </span>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Unique Tracking ID
                </span>
                <span className="font-mono text-lg font-bold text-blue-700">
                  {createdComplaint.trackingNumber}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Copy className="w-4 h-4" />}
                onClick={copyTrackingNumber}
              >
                Copy Tracking ID
              </Button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <dt className="text-slate-400">Target Institution</dt>
                <dd className="font-semibold text-slate-900 mt-1 text-sm">
                  {createdComplaint.institution?.name}
                </dd>
                <dd className="text-slate-500 font-mono text-[11px]">
                  AICTE ID: {createdComplaint.institution?.aicteId}
                </dd>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <dt className="text-slate-400">Assigned Bureau & Priority</dt>
                <dd className="font-semibold text-slate-900 mt-1 text-sm">
                  {BUREAU_LABELS[createdComplaint.bureau]}
                </dd>
                <dd className="mt-1">
                  <Badge className={PRIORITY_COLORS[createdComplaint.priority]}>
                    {createdComplaint.priority} PRIORITY
                  </Badge>
                </dd>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <dt className="text-slate-400">Grievance Subject</dt>
                <dd className="font-semibold text-slate-900 mt-1 text-sm">
                  {createdComplaint.subject}
                </dd>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <dt className="text-slate-400">Complainant / Submitter</dt>
                <dd className="font-semibold text-slate-900 mt-1 text-sm">
                  {createdComplaint.complainantName}
                </dd>
                <dd className="text-slate-500 text-[11px]">
                  {createdComplaint.complainantContact}
                </dd>
              </div>
            </dl>

            {/* Overlap Radar Notice if flagged */}
            {existingGrievancesForInst.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">AI Overlap Scan Initiated</p>
                  <p className="text-amber-800 mt-0.5">
                    This institution already had existing complaints in the repository. AICTE VIGIL
                    has automatically flagged this dossier for cross-bureau correlation.
                  </p>
                </div>
              </div>
            )}

            {/* Receipt Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="md"
                icon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Acknowledgement
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setCreatedComplaint(null);
                    setSubject('');
                    setDescription('');
                    setStep(1);
                  }}
                >
                  Register Another
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate(`/complaints/${createdComplaint.id}`)}
                >
                  Open Case Dossier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs',
    'focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all',
  );

  const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Grievance Registration Console"
        subtitle="Intake portal for technical education compliance violations, fee disputes, ragging & institutional complaints"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Complaints', href: '/complaints' },
          { label: 'New Grievance' },
        ]}
      />

      {/* Progress Steps Header */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { num: 1, title: 'Classification', desc: 'Bureau & Category' },
          { num: 2, title: 'Institution', desc: 'Target & Overlap Check' },
          { num: 3, title: 'Evidence & Details', desc: 'Narrative & Submitter' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as any)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer',
              step === s.num
                ? 'bg-white shadow-xs border border-slate-200/80 text-blue-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                step === s.num
                  ? 'bg-blue-600 text-white'
                  : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600',
              )}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-xs font-bold leading-tight truncate">{s.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Card padding="lg" className="border-slate-200 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Classification & Bureau */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <CardHeader subtitle="Specify the handling bureau and statutory grievance classification">
                Step 1: Jurisdiction & Category
              </CardHeader>

              {/* Bureau Selection */}
              <div>
                <label className={labelClass}>Allocated Bureau *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'RB',
                      label: 'Regulation Bureau (RB)',
                      desc: 'Course approvals, faculty norms, land, building, and regulatory handbook violations',
                    },
                    {
                      id: 'PGRC',
                      label: 'Public Grievance Cell (PGRC)',
                      desc: 'Fee disputes, refunds, harassment, capitation, anti-ragging & student welfare',
                    },
                    {
                      id: 'OTHER',
                      label: 'Other Specialized Cells',
                      desc: 'Skill development, NEAT, minority cell, and miscellaneous administrative concerns',
                    },
                  ].map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setBureau(b.id as Bureau)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between',
                        bureau === b.id
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white',
                      )}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{b.label}</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{b.desc}</p>
                      </div>
                      <div className="mt-3 text-right">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full',
                            bureau === b.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {bureau === b.id ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Grievance Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    Object.entries(CATEGORY_LABELS) as [ComplaintCategory, string][]
                  ).map(([catKey, catLabel]) => (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all cursor-pointer text-xs font-semibold',
                        category === catKey
                          ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white',
                      )}
                    >
                      {catLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className={labelClass}>Statutory Escalation Priority *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'CRITICAL', label: 'Critical', hint: 'Ragging / Urgent Risk (7 Days)' },
                    { id: 'HIGH', label: 'High', hint: 'Severe Non-compliance (15 Days)' },
                    { id: 'MEDIUM', label: 'Medium', hint: 'Fee / Ratio Disputes (30 Days)' },
                    { id: 'LOW', label: 'Low', hint: 'Procedural Inquiries (45 Days)' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPriority(p.id as ComplaintPriority)}
                      className={cn(
                        'p-3 rounded-xl border transition-all cursor-pointer text-left',
                        priority === p.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800',
                      )}
                    >
                      <p className="text-xs font-bold leading-tight">{p.label}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-1',
                          priority === p.id ? 'text-slate-300' : 'text-slate-500',
                        )}
                      >
                        {p.hint}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  type="button"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(2)}
                >
                  Continue to Institution
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Target Institution & Overlap Pre-Check */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <CardHeader subtitle="Locate the technical institution against which the complaint is lodged">
                Step 2: Technical Institution
              </CardHeader>

              <div>
                <label className={labelClass}>Select AICTE Approved Institution *</label>
                <select
                  className={inputClass}
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  required
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} — {i.aicteId} ({i.city}, {i.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Card Preview */}
              {selectedInstitution && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedInstitution.name}
                      </h4>
                      <p className="font-mono text-xs text-blue-700 mt-0.5">
                        Permanent AICTE ID: {selectedInstitution.aicteId}
                      </p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200">
                      {selectedInstitution.approvalStatus}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Type</span>
                      <span className="font-medium">{selectedInstitution.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <span className="font-medium">
                        {selectedInstitution.city}, {selectedInstitution.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Active Grievances</span>
                      <span className="font-bold text-amber-600">
                        {existingGrievancesForInst.length} On File
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time AI Duplicate & Overlap Warning Banner */}
              {existingGrievancesForInst.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Real-Time AI Overlap Warning ({existingGrievancesForInst.length} Active Records)</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Notice: Other complaints are currently active for this institution. Your submission
                    will be cross-referenced by the AICTE Overlap Detection Engine to prevent redundant inquiry.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {existingGrievancesForInst.slice(0, 2).map((eg) => (
                      <div
                        key={eg.id}
                        className="p-2 rounded-lg bg-white/80 border border-amber-200 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-[11px] font-semibold text-blue-700">
                          {eg.trackingNumber} ({eg.bureau})
                        </span>
                        <span className="text-slate-700 truncate max-w-xs">{eg.subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  type="button"
                  size="md"
                  icon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(3)}
                >
                  Continue to Grievance Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Details & Documentation */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <CardHeader subtitle="Provide factual details, evidence, and submitter contact information">
                Step 3: Narrative & Evidence
              </CardHeader>

              <div>
                <label className={labelClass}>Grievance Subject Summary *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Unauthorized B.Tech courses conducted without AICTE Approval"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Detailed Statement of Facts *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details including names, departments, affected semester, and regulatory norms violated..."
                  className={inputClass}
                />
              </div>

              {/* Complainant Info & Anonymous Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Whistleblower Protection / Anonymous Filing
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Shield your personal identity from institution authorities
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Complainant Name
                      </label>
                      <input
                        type="text"
                        value={complainantName}
                        onChange={(e) => setComplainantName(e.target.value)}
                        placeholder="Full Legal Name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Email or Mobile Number
                      </label>
                      <input
                        type="text"
                        value={complainantContact}
                        onChange={(e) => setComplainantContact(e.target.value)}
                        placeholder="official@domain.com or +91..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Custom SLA Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Resolution Target Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Defaults to statutory 30-day window if left blank.
                  </p>
                </div>

                {/* Evidence Upload Simulator */}
                <div>
                  <label className={labelClass}>Documentary Evidence (Optional)</label>
                  <div
                    onClick={() => {
                      setFilesAttached((prev) => [
                        ...prev,
                        `annexure-${prev.length + 1}-affidavit.pdf`,
                      ]);
                      addToast({
                        title: 'Document Attached',
                        message: 'Evidence PDF added to dossier.',
                        type: 'info',
                      });
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-4 rounded-xl text-center cursor-pointer transition-colors bg-white hover:bg-blue-50/20"
                  >
                    <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-blue-600 block">
                      Click to simulate upload
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</span>
                  </div>

                  {filesAttached.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filesAttached.map((file, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border"
                        >
                          <FileCheck className="w-3 h-3 text-emerald-600" />
                          {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  type="button"
                  size="md"
                  icon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Register & Generate Tracking Code
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
