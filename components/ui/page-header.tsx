"use client";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-slate-500">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
