"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, UserPlus, Clock } from "lucide-react";
import { useRegistrationRequests } from "@/hooks/api/use-registration";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch only pending requests for notifications
  const { data } = useRegistrationRequests("PENDING", 1, 10);

  const pendingCount = data?.total || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {pendingCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h3>
            {pendingCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                {pendingCount} new
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {!data || pendingCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                  <Bell className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  No new notifications
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {data.requests.map((request) => (
                  <Link
                    key={request.id}
                    href="/admin/registration-requests"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          New registration request
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {request.name} ({request.countryCode}{" "}
                          {request.phoneNumber})
                        </p>
                        <div className="mt-1 flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(
                              new Date(request.requestedAt),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {pendingCount > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/admin/registration-requests"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all {pendingCount} request{pendingCount !== 1 ? "s" : ""}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
