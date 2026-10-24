import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: { value: number; label: string };
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  iconBg = 'bg-navy-50',
  iconColor = 'text-navy-600',
  className,
}: StatCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-5', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-lg', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {change && (
          <span
            className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded',
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
            )}
          >
            {isPositive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
