import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: { value: number; label: string };
  iconBg?: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  badge,
  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200',
  onClick,
  className,
}: StatCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div
          className={cn(
            'p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-2xs',
            iconBg,
          )}
        >
          <Icon className={cn('w-4.5 h-4.5', iconColor)} />
        </div>
        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200',
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change.value)}%
          </span>
        )}
        {badge && (
          <span
            className={cn(
              'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
              badgeColor,
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none mt-1 font-sans">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </p>
        <p className="text-xs font-medium text-slate-500 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
}
