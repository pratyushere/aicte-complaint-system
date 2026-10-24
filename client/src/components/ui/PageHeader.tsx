import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold sm:font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap pt-1 sm:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
