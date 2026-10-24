import { PageHeader, EmptyState } from '@/components/ui';
import { BarChart3 } from 'lucide-react';

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export analytical reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Reports' }]}
      />
      <EmptyState
        icon={<BarChart3 className="w-8 h-8" />}
        title="Reports"
        description="Bureau-level analytics, custom date-range filtering, and exportable reports will be available once the backend and reporting engine are implemented."
      />
    </div>
  );
}
