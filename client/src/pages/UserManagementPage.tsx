import { PageHeader, EmptyState } from '@/components/ui';
import { Users } from 'lucide-react';

export function UserManagementPage() {
  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage officers, admins, and role assignments"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'User Management' }]}
      />
      <EmptyState
        icon={<Users className="w-8 h-8" />}
        title="User Management"
        description="User accounts, role-based access control, and bureau assignments will be managed here once authentication is implemented."
      />
    </div>
  );
}
