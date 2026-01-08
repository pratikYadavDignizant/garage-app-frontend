import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-slate-500",
        className,
      )}
    >
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Dashboard</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center space-x-1",
                  isLast && "font-medium text-slate-900 dark:text-slate-100",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
