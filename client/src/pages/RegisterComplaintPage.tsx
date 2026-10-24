import { PageHeader, Card, CardHeader, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, BUREAU_LABELS } from '@/lib/constants';
import { mockInstitutions } from '@/lib/mock-data';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inputClass = cn(
  'w-full px-3 py-2 rounded-md text-sm',
  'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400',
  'focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20',
);

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export function RegisterComplaintPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div>
        <PageHeader
          title="Register Complaint"
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Complaints', href: '/complaints' }, { label: 'Register' }]}
        />
        <Card padding="lg" className="max-w-2xl">
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">Form Submitted (Demo)</p>
            <p className="text-sm text-gray-500 mb-4">
              This is a frontend placeholder. No data was saved — the backend is not yet connected.
            </p>
            <Button variant="secondary" onClick={() => navigate('/complaints')}>
              Back to Complaints
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Register Complaint"
        subtitle="Submit a new complaint for processing"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Complaints', href: '/complaints' }, { label: 'Register' }]}
      />

      <Card padding="lg" className="max-w-3xl">
        <CardHeader>Complaint Information</CardHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bureau *</label>
              <select className={inputClass} required>
                <option value="">Select Bureau</option>
                {Object.entries(BUREAU_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select className={inputClass} required>
                <option value="">Select Category</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Institution *</label>
            <select className={inputClass} required>
              <option value="">Select Institution</option>
              {mockInstitutions.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.aicteId})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Priority *</label>
              <select className={inputClass} required>
                <option value="">Select Priority</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Deadline</label>
              <input type="date" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Subject *</label>
            <input type="text" className={inputClass} placeholder="Brief summary of the complaint" required />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea className={cn(inputClass, 'min-h-[120px]')} placeholder="Detailed description of the complaint…" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Complainant Name</label>
              <input type="text" className={inputClass} placeholder="Name of the person filing" />
            </div>
            <div>
              <label className={labelClass}>Complainant Contact</label>
              <input type="text" className={inputClass} placeholder="Email or phone number" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">Submit Complaint (Demo)</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/complaints')}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            This form is a frontend placeholder. Submission will not persist data until the backend is connected.
          </p>
        </form>
      </Card>
    </div>
  );
}
