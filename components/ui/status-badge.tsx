import { cn } from "@/lib/utils";
import type { RegistrationStatus } from "@/lib/types/registration";

interface StatusBadgeProps {
  status: RegistrationStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  size = "md",
  className,
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const statusConfig = {
    PENDING: {
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    },
    APPROVED: {
      label: "Approved",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    },
    REJECTED: {
      label: "Rejected",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium",
        sizeClasses[size],
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
