import { PageHeader, Card, Button } from '@/components/ui';
import { mockNotifications } from '@/lib/mock-data';
import { cn, relativeTime } from '@/lib/utils';
import { Bell, AlertTriangle, Clock, UserPlus, ArrowUpRight, RefreshCw, CheckCheck } from 'lucide-react';
import type { NotificationType } from '@/types';

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  OVERLAP_DETECTED: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  DEADLINE_WARNING: { icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
  ASSIGNMENT: { icon: UserPlus, color: 'text-navy-600', bg: 'bg-navy-50' },
  ESCALATION: { icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
  STATUS_CHANGE: { icon: RefreshCw, color: 'text-green-600', bg: 'bg-green-50' },
};

export function NotificationsPage() {
  const unread = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread — sample notifications`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Notifications' }]}
        actions={
          <Button variant="ghost" size="sm" icon={<CheckCheck className="w-4 h-4" />} disabled>
            Mark All Read (not implemented)
          </Button>
        }
      />

      <div className="space-y-2 max-w-3xl">
        {mockNotifications.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <Card key={n.id} padding="none"
              className={cn(!n.isRead && 'border-l-2 border-l-navy-500')}>
              <div className="flex items-start gap-3 px-4 py-3">
                <div className={cn('p-2 rounded-md shrink-0', cfg.bg, cfg.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={cn('text-sm', n.isRead ? 'text-gray-600' : 'text-gray-900 font-medium')}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {relativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-navy-500 shrink-0 mt-1.5" />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
