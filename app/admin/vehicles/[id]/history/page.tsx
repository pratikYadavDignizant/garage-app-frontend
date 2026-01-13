"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useServices,
  ServiceItem,
  calculateTotalCost,
} from "@/hooks/api/use-services";
import { useVehicle } from "@/hooks/api/use-vehicles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Car,
  Clock,
  History,
  MessageSquare,
  Wrench,
  Loader2,
  ShoppingCart,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type SortOrder = "newest" | "oldest";

export default function VehicleHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const { data: vehicle } = useVehicle(vehicleId);
  const { data: services, isLoading } = useServices(vehicleId);

  const sortedServices = services
    ? [...services].sort((a, b) => {
        const dateA = new Date(a.serviceDate).getTime();
        const dateB = new Date(b.serviceDate).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 animate-pulse">
          Loading service history...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit text-slate-500 hover:text-slate-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {vehicle?.model || "Vehicle History"}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span className="font-mono">{vehicle?.numberPlate}</span>
                <span>•</span>
                <span>{vehicle?.customer?.name || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-2 py-1">
              {services?.length || 0} Services
            </Badge>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="flex h-9 items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {sortedServices && sortedServices.length > 0 ? (
          sortedServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors"
            >
              {/* Service Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Service Record
                      </h3>
                      {index === 0 && sortOrder === "newest" && (
                        <Badge variant="default" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mt-0.5">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {format(new Date(service.serviceDate), "PPP")}
                      <span className="mx-2">•</span>
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      Next:{" "}
                      {format(new Date(service.nextServiceDate), "MMM yyyy")}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {service.intervalMonths}mo interval
                </Badge>
              </div>

              {/* Service Items */}
              {service.serviceItems && service.serviceItems.length > 0 && (
                <div className="mt-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Items ({service.serviceItems.length})</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ₹
                      {calculateTotalCost(
                        service.serviceItems,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {service.serviceItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm py-1.5 px-2 rounded bg-white dark:bg-slate-900"
                      >
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.service}
                        </span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          ₹{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {service.notes && (
                <div className="mt-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-400">
                        Notes
                      </span>
                      <p className="text-sm text-amber-800 dark:text-amber-300/90 mt-0.5">
                        {service.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
            <History className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
              No Service History
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              This vehicle hasn't had any recorded services yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
