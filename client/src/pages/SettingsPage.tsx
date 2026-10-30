import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, CardHeader, Button } from '@/components/ui';
import {
  Save,
  Sparkles,
  Smartphone,
  Mail,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';

export function SettingsPage() {
  const { currentUser, addToast } = useAppStore();

  const [officerName, setOfficerName] = useState(currentUser.name);
  const [officerEmail, setOfficerEmail] = useState(currentUser.email);
  const [overlapThreshold, setOverlapThreshold] = useState(80);
  const [criticalSla, setCriticalSla] = useState(7);
  const [highSla, setHighSla] = useState(15);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsUrgent, setSmsUrgent] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Configuration Saved',
      message: 'System preferences and SLA rules updated successfully.',
      type: 'success',
    });
  };

  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 text-slate-900',
    'focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all',
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="System Configuration & Preferences"
        subtitle="Manage officer identity, AI overlap sensitivity thresholds, statutory SLA timing rules, and security policies"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Identity Profile */}
        <Card padding="lg">
          <CardHeader subtitle="Official credentials and bureau affiliation">
            Officer Profile & Bureau Jurisdiction
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Officer Full Name
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Official Email Address
              </label>
              <input
                type="email"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Active Security Role
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                {ROLE_LABELS[currentUser.role] || currentUser.role}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Assigned Bureau / Cell
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                {currentUser.bureau?.name || 'Regulation Bureau'} ({currentUser.region})
              </div>
            </div>
          </div>
        </Card>

        {/* AI Overlap Detection Sensitivity */}
        <Card padding="lg">
          <CardHeader subtitle="Calibrate algorithmic cross-bureau duplication and text similarity parameters">
            AI Overlap Detection Engine Tuning
          </CardHeader>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Similarity Score Flagging Threshold
                </span>
                <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {overlapThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={overlapThreshold}
                onChange={(e) => setOverlapThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>60% (High sensitivity, more flags)</span>
                <span>80% (Recommended AICTE default)</span>
                <span>95% (Exact matches only)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Algorithm Scope:</strong> The radar checks institutional AICTE ID matches (weight: 40%),
              NLP semantic subject similarity (25%), grievance category match (20%), and filing date proximity (15%).
            </div>
          </div>
        </Card>

        {/* SLA & Escalation Rules */}
        <Card padding="lg">
          <CardHeader subtitle="Statutory countdown thresholds for case determination">
            Statutory SLA Window Configuration
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Critical Priority Target SLA (Days)
              </label>
              <input
                type="number"
                min="3"
                max="14"
                value={criticalSla}
                onChange={(e) => setCriticalSla(Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard: 7 calendar days for anti-ragging & urgent student safety.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                High Priority Target SLA (Days)
              </label>
              <input
                type="number"
                min="7"
                max="30"
                value={highSla}
                onChange={(e) => setHighSla(Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard: 15 days for unapproved courses & major fee disputes.
              </span>
            </div>
          </div>
        </Card>

        {/* Notification Channels & Security */}
        <Card padding="lg">
          <CardHeader subtitle="Automated dispatch channels and session timeout">
            Notification Dispatches & Security
          </CardHeader>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Daily Digest Dispatch</span>
                  <span className="text-[11px] text-slate-500">
                    Send daily consolidated email briefing of new grievances
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="font-bold text-slate-900 block">SMS Urgent SLA Triggers</span>
                  <span className="text-[11px] text-slate-500">
                    Dispatch immediate SMS alert to Regional Director for Critical ragging reports
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsUrgent}
                onChange={(e) => setSmsUrgent(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Session Idle Inactivity Timeout</span>
                  <span className="text-[11px] text-slate-500">
                    Auto sign out when officer is away from console
                  </span>
                </div>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            icon={<Save className="w-4 h-4" />}
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
