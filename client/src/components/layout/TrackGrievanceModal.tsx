import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { Modal, Badge, Button } from '@/components/ui';
import { Search, ArrowRight, Building2, Shield, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import type { Complaint } from '@/types';

export function TrackGrievanceModal() {
  const navigate = useNavigate();
  const { trackModalOpen, setTrackModalOpen, complaints } = useAppStore();

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Complaint | null | undefined>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();
    const found = complaints.find(
      (c) =>
        c.trackingNumber.toLowerCase() === trimmed ||
        c.id.toLowerCase() === trimmed,
    );
    setResult(found || null);
  };

  const handleClose = () => {
    setTrackModalOpen(false);
    setQuery('');
    setResult(undefined);
  };

  const quickSamples = ['RB-2024-00147', 'PGRC-2024-00389', 'RB-2024-00215'];

  return (
    <Modal
      isOpen={trackModalOpen}
      onClose={handleClose}
      title="Track Grievance Status"
      subtitle="Enter your unique tracking code to view real-time investigation stage and SLA progress"
    >
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Grievance Tracking Number *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (result !== undefined) setResult(undefined);
              }}
              placeholder="e.g. RB-2024-00147 or PGRC-2024-00389"
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <Button variant="primary" type="submit" size="sm" icon={<Search className="w-3.5 h-3.5" />}>
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span>Quick samples:</span>
            {quickSamples.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  const found = complaints.find(
                    (c) => c.trackingNumber.toLowerCase() === sample.toLowerCase(),
                  );
                  setResult(found || null);
                }}
                className="font-mono text-blue-700 hover:text-blue-900 hover:underline px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Result Display */}
      {result !== undefined && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          {result ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {result.trackingNumber}
                </span>
                <Badge className={STATUS_COLORS[result.status]} dot>
                  {STATUS_LABELS[result.status]}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{result.subject}</h4>
                <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{result.institution?.name}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600 pt-2 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Bureau</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Shield className="w-3 h-3 text-blue-600" />
                    {result.bureau} Bureau
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Priority</span>
                  <div className="mt-0.5">
                    <Badge className={PRIORITY_COLORS[result.priority]}>
                      {PRIORITY_LABELS[result.priority]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Registered On</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(result.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Resolution Target</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {result.deadline ? formatDate(result.deadline) : 'Within 30 Days'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => {
                    handleClose();
                    navigate(`/complaints/${result.id}`);
                  }}
                >
                  Open Complete Case Dossier
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center">
              No grievance record found for tracking code <code className="font-bold">{query}</code>. Please double-check your tracking ID or contact the central helpline.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
