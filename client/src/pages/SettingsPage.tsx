import { PageHeader, EmptyState } from '@/components/ui';
import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Application configuration and preferences"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}
      />
      <EmptyState
        icon={<Settings className="w-8 h-8" />}
        title="Settings"
        description="Profile preferences, notification settings, bureau configuration, and system-wide options will be available after authentication is implemented."
      />
    </div>
  );
}
