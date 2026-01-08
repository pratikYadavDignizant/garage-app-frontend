"use client";

import { useAdminSummary } from "@/hooks/api/use-summary";
import { useRegistrationRequests } from "@/hooks/api/use-registration";
import {
  Users,
  Car,
  Wrench,
  AlertCircle,
  Building2,
  Bell,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useAdminSummary();
  const { data: pendingRequests } = useRegistrationRequests("PENDING", 1, 1);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your garage management system"
          icon={Activity}
        />
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening with your garage management system."
          icon={Activity}
          breadcrumbs={[{ label: "Dashboard" }]}
        />
      </div>

      {/* Garage Statistics Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Garage Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Garages"
            value={data?.garages.total ?? 0}
            icon={Building2}
            color="blue"
            description="All registered garages"
          />
          <StatCard
            title="Active Garages"
            value={data?.garages.active ?? 0}
            icon={Building2}
            color="green"
            description="Currently operational"
          />
          <StatCard
            title="Inactive Garages"
            value={data?.garages.inactive ?? 0}
            icon={Building2}
            color="red"
            description="Temporarily closed"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests?.total ?? 0}
            icon={UserPlus}
            color="orange"
            description="Awaiting approval"
          />
        </div>
      </div>

      {/* Business Metrics Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-purple-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Business Metrics
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Customers"
            value={data?.customers ?? 0}
            icon={Users}
            color="purple"
            description="Registered customers"
          />
          <StatCard
            title="Total Vehicles"
            value={data?.vehicles ?? 0}
            icon={Car}
            color="indigo"
            description="Vehicles in system"
          />
          <StatCard
            title="Total Services"
            value={data?.services ?? 0}
            icon={Wrench}
            color="blue"
            description="Services completed"
          />
        </div>
      </div>

      {/* Reminders Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Reminder Status
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Overdue Reminders"
            value={data?.reminders.overdue ?? 0}
            icon={AlertCircle}
            color="red"
            description="Requires immediate attention"
          />
          <StatCard
            title="Reminders Today"
            value={data?.reminders.today ?? 0}
            icon={Bell}
            color="orange"
            description="Due today"
          />
          <StatCard
            title="Upcoming Reminders"
            value={data?.reminders.upcoming ?? 0}
            icon={Bell}
            color="green"
            description="Next 7 days"
          />
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              System Health
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              All systems operational
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Rate
            </p>
            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
              {data?.garages.total
                ? Math.round((data.garages.active / data.garages.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Avg Vehicles
            </p>
            <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
              {data?.garages.total
                ? Math.round((data.vehicles ?? 0) / data.garages.total)
                : 0}
            </p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Avg Services
            </p>
            <p className="mt-1 text-lg font-bold text-purple-600 dark:text-purple-400">
              {data?.garages.total
                ? Math.round((data.services ?? 0) / data.garages.total)
                : 0}
            </p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reminder Rate
            </p>
            <p className="mt-1 text-lg font-bold text-orange-600 dark:text-orange-400">
              {data?.vehicles
                ? Math.round(
                    ((data.reminders.overdue +
                      data.reminders.today +
                      data.reminders.upcoming) /
                      data.vehicles) *
                      100,
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
