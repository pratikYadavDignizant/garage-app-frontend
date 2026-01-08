"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "purple" | "green" | "orange" | "red" | "indigo" | "pink";
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  description?: string;
}

const colorClasses = {
  blue: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    icon: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
  },
  purple: {
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50 dark:bg-purple-900/10",
    icon: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-500/20",
  },
  green: {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-900/10",
    icon: "text-green-600 dark:text-green-400",
    ring: "ring-green-500/20",
  },
  orange: {
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-900/10",
    icon: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-500/20",
  },
  red: {
    gradient: "from-red-500 to-rose-500",
    bg: "bg-red-50 dark:bg-red-900/10",
    icon: "text-red-600 dark:text-red-400",
    ring: "ring-red-500/20",
  },
  indigo: {
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    ring: "ring-indigo-500/20",
  },
  pink: {
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/10",
    icon: "text-pink-600 dark:text-pink-400",
    ring: "ring-pink-500/20",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  description,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background Effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
          colors.gradient,
        )}
      />

      {/* Decorative Circle */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl transition-all duration-300 group-hover:scale-150",
          colors.bg,
        )}
      />

      <div className="relative">
        {/* Icon and Title Row */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            {description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {description}
              </p>
            )}
          </div>

          {/* Icon with gradient background */}
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-xl ring-4 transition-all duration-300 group-hover:scale-110",
              colors.bg,
              colors.ring,
            )}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                colors.gradient,
              )}
            />
            <Icon
              className={cn(
                "relative h-6 w-6 transition-colors duration-300",
                colors.icon,
              )}
            />
          </div>
        </div>

        {/* Value */}
        <div className="mt-4">
          <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                trend.direction === "up"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              vs last month
            </span>
          </div>
        )}
      </div>

      {/* Bottom gradient line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colors.gradient,
        )}
      />
    </div>
  );
}
