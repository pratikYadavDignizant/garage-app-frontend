"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  Wrench,
  Bell,
  FileJson,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { useRegistrationRequests } from "@/hooks/api/use-registration";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Garages", href: "/admin/garages", icon: Building2 },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Vehicles", href: "/admin/vehicles", icon: Car },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Reminders", href: "/admin/reminders", icon: Bell },
  {
    name: "Registration Requests",
    href: "/admin/registration-requests",
    icon: UserPlus,
    showBadge: true, // Flag to show badge for this item
  },
  { name: "Templates", href: "/admin/templates", icon: FileJson },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch pending registration requests count
  const { data: pendingRequests } = useRegistrationRequests("PENDING", 1, 1);
  const pendingCount = pendingRequests?.total || 0;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GarageAdmin
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.showBadge && pendingCount > 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {showBadge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && showBadge && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors",
            isCollapsed && "justify-center",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
