import { PageHeader, EmptyState } from '@/components/ui';
import { GitCompareArrows } from 'lucide-react';

export function CoordinationPage() {
  return (
    <div>
      <PageHeader
        title="Coordination"
        subtitle="Coordinate handling of linked complaints across bureaus"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Coordination' }]}
      />
      <EmptyState
        icon={<GitCompareArrows className="w-8 h-8" />}
        title="Coordination View"
        description="This page will display linked complaint groups and enable cross-bureau coordination once the overlap detection backend is connected."
      />
    </div>
  );
}
