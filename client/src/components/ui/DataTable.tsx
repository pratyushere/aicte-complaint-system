import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptySubtext?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No matching records found.',
  emptySubtext,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'group transition-colors duration-150',
                  onRowClick
                    ? 'hover:bg-blue-50/40 cursor-pointer'
                    : 'hover:bg-slate-50/60',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-slate-700 align-middle',
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">{emptyMessage}</p>
          {emptySubtext && (
            <p className="text-xs text-slate-400 mt-1 max-w-sm">{emptySubtext}</p>
          )}
        </div>
      )}
    </div>
  );
}

export type { Column };
