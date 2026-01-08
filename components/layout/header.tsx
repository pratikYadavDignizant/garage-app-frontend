"use client";

import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "./notification-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search garages, customers..."
            className="pl-10 h-9 bg-slate-50 border-transparent focus:bg-white transition-colors dark:bg-slate-800"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationDropdown />
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="hidden flex-col text-left md:flex">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Admin User
            </span>
            <span className="text-xs text-slate-500">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
