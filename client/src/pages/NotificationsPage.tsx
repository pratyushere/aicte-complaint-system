import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, Button } from '@/components/ui';
import { cn, relativeTime, formatDate } from '@/lib/utils';
import {
  Bell,
  AlertTriangle,
  Clock,
  UserPlus,
  ArrowUpRight,
  RefreshCw,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import type { NotificationType } from '@/types';

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  OVERLAP_DETECTED: { icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-100' },
  DEADLINE_WARNING: { icon: Clock, color: 'text-rose-700', bg: 'bg-rose-100' },
  ASSIGNMENT: { icon: UserPlus, color: 'text-blue-700', bg: 'bg-blue-100' },
  ESCALATION: { icon: ArrowUpRight, color: 'text-rose-700', bg: 'bg-rose-100' },
  STATUS_CHANGE: { icon: RefreshCw, color: 'text-emerald-700', bg: 'bg-emerald-100' },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useAppStore();

  const [filterTab, setFilterTab] = useState<'ALL' | 'UNREAD' | 'OVERLAPS' | 'DEADLINES'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filterTab === 'UNREAD') return !n.isRead;
    if (filterTab === 'OVERLAPS') return n.type === 'OVERLAP_DETECTED';
    if (filterTab === 'DEADLINES') return n.type === 'DEADLINE_WARNING';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Statutory Notifications"
        subtitle={`System notifications, SLA warnings, and AI overlap detection dispatches (${unreadNotificationCount} unread)`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={clearNotifications}
            >
              Clear Center
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<CheckCheck className="w-4 h-4 text-emerald-600" />}
              onClick={markAllNotificationsAsRead}
              disabled={unreadNotificationCount === 0}
            >
              Mark All as Read
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'ALL', label: `All Alerts (${notifications.length})` },
          { id: 'UNREAD', label: `Unread (${unreadNotificationCount})` },
          { id: 'OVERLAPS', label: 'Overlap Alerts' },
          { id: 'DEADLINES', label: 'SLA Deadlines' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap',
              filterTab === tab.id
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-2.5 max-w-4xl">
        {filtered.length === 0 ? (
          <Card padding="lg">
            <div className="py-12 text-center text-xs text-slate-400">
              No notifications matching this filter category.
            </div>
          </Card>
        ) : (
          filtered.map((n) => {
            const cfg = typeConfig[n.type] || { icon: Bell, color: 'text-slate-700', bg: 'bg-slate-100' };
            const Icon = cfg.icon;

            return (
              <Card
                key={n.id}
                padding="none"
                hover
                className={cn(
                  'cursor-pointer transition-all border-slate-200',
                  !n.isRead && 'border-l-4 border-l-blue-600 bg-blue-50/20',
                )}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.type === 'OVERLAP_DETECTED') {
                    navigate('/overlaps');
                  } else if (n.referenceType === 'complaint') {
                    navigate(`/complaints/${n.referenceId}`);
                  }
                }}
              >
                <div className="flex items-start gap-4 p-4">
                  <div className={cn('p-2.5 rounded-xl shrink-0 mt-0.5 shadow-2xs', cfg.bg, cfg.color)}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'text-xs sm:text-sm font-bold',
                            n.isRead ? 'text-slate-700' : 'text-slate-900',
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                        {relativeTime(n.createdAt)} • {formatDate(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-blue-600 font-medium">
                      <span>Click to view associated file docket →</span>
                      {!n.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(n.id);
                          }}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
