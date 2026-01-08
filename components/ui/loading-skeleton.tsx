'use client';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'list';
  rows?: number;
  count?: number;
}

export function LoadingSkeleton({ type = 'table', rows = 5, count = 4 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 animate-pulse">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: table skeleton
  return (
    <div className="space-y-3">
      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 animate-pulse">
          <div className="flex items-center h-full px-4 space-x-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
