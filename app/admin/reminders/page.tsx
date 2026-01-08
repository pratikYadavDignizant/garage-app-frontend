"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Send,
  Calendar,
  Phone,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  useReminders,
  useSendReminder,
  Reminder,
} from "@/hooks/api/use-reminders";

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "overdue">(
    "today",
  );

  // Fetch counts for all tabs
  const { data: todayData } = useReminders("today");
  const { data: upcomingData } = useReminders("upcoming");
  const { data: overdueData } = useReminders("overdue");

  // Get active tab data and loading state
  const { data, isLoading } = useReminders(activeTab);
  const sendReminder = useSendReminder();

  const handleSendReminder = (id: string) => {
    sendReminder.mutate(id);
  };

  const columns: ColumnDef<Reminder>[] = [
    {
      accessorKey: "nextServiceDate",
      header: "Next Service",
      cell: ({ row }) => (
        <div className="flex items-center font-medium">
          <Calendar className="mr-2 h-4 w-4 text-slate-500" />
          {formatDate(row.getValue("nextServiceDate"))}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.vehicle?.customer;
        return (
          <div className="flex flex-col">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <User className="mr-2 h-4 w-4 text-slate-400" />
              {customer?.name || "N/A"}
            </div>
            <div className="flex items-center text-xs text-slate-500 ml-6">
              <Phone className="mr-1 h-3 w-3" />
              {customer?.countryCode && customer?.phoneNumber
                ? `${customer.countryCode} ${customer.phoneNumber}`
                : "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicleModel",
      header: "Vehicle",
      cell: ({ row }) => {
        const vehicle = row.original.vehicle;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {vehicle?.model || "N/A"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {vehicle?.numberPlate || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Priority",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge
            variant={
              type === "overdue"
                ? "destructive"
                : type === "today"
                  ? "warning"
                  : "secondary"
            }
            className="capitalize"
          >
            {type}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleSendReminder(row.original.id)}
          disabled={sendReminder.isPending}
        >
          <Send className="mr-2 h-3 w-3" /> Send Reminder
        </Button>
      ),
    },
  ];

  const tabs = [
    { id: "today", label: "Due Today", icon: Clock, color: "text-amber-500" },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      id: "overdue",
      label: "Overdue",
      icon: AlertCircle,
      color: "text-red-500",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reminders" }]} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Reminders
        </h1>
        <p className="text-slate-500">
          Track and send service reminders to customers.
        </p>
      </div>

      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          // Get count for each tab
          const count =
            tab.id === "today"
              ? todayData?.length || 0
              : tab.id === "upcoming"
                ? upcomingData?.length || 0
                : overdueData?.length || 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
              {count > 0 && (
                <Badge
                  variant={tab.id === "overdue" ? "destructive" : "secondary"}
                  className="ml-1"
                >
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        searchKey="customerName"
        loading={isLoading}
      />
    </div>
  );
}
