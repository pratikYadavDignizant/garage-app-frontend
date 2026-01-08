"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addMonths } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Loader2,
  Calendar,
  Send,
  Download,
  Building2,
  User,
  Eye,
  Bell,
  Car,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { formatPhoneNumber } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useServices,
  useCreateService,
  Service,
} from "@/hooks/api/use-services";
import { useSendReminder } from "@/hooks/api/use-reminders";
import { useVehicles } from "@/hooks/api/use-vehicles";

const serviceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceDate: z.string().min(1, "Service date is required"),
  intervalMonths: z.enum(["1", "2", "3", "6"]).transform(Number),
  notes: z.string().optional(),
});

type ServiceFormValues = {
  vehicleId: string;
  serviceDate: string;
  intervalMonths: string;
  notes?: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const { data, isLoading } = useServices();
  const createMutation = useCreateService();
  const sendReminder = useSendReminder();

  // Fetch vehicles for selection
  const { data: allVehicles, isLoading: isVehiclesLoading } = useVehicles();

  const filteredVehicles = allVehicles?.data
    ?.filter(
      (v) =>
        v.numberPlate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.model.toLowerCase().includes(vehicleSearch.toLowerCase()),
    )
    .slice(0, 5);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema as any),
    defaultValues: {
      serviceDate: format(new Date(), "yyyy-MM-dd"),
      intervalMonths: "6",
    },
  });

  const selectedVehicleId = watch("vehicleId");

  const onSubmit = (values: ServiceFormValues) => {
    // Calculate next service date
    const nextDate = addMonths(
      new Date(values.serviceDate),
      Number(values.intervalMonths),
    );

    createMutation.mutate(
      {
        ...values,
        intervalMonths: Number(values.intervalMonths) as any,
        nextServiceDate: format(nextDate, "yyyy-MM-dd"),
      },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          reset();
          setVehicleSearch("");
        },
      },
    );
  };

  const handleSendReminder = (serviceId: string) => {
    sendReminder.mutate(serviceId);
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "serviceDate",
      header: "Service Date",
      cell: ({ row }) => {
        const date = row.getValue("serviceDate") as string;
        return (
          <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
            <Calendar className="mr-2 h-4 w-4 text-slate-500" />
            {date
              ? new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "nextServiceDate",
      header: "Next Service",
      cell: ({ row }) => {
        const date = row.getValue("nextServiceDate") as string;
        return (
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
            {date
              ? new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle & Owner",
      cell: ({ row }) => {
        const service = row.original;
        const vehicle = service.vehicle;
        const customer = vehicle?.customer;

        return (
          <div className="flex flex-col">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <Car className="mr-2 h-4 w-4 text-slate-400" />
              <span>{vehicle?.model || "N/A"}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono ml-6">
              {vehicle?.numberPlate || "N/A"}
            </span>
            {customer && (
              <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mt-1 ml-6">
                <User className="mr-1 h-3 w-3" />
                <span>{customer.name}</span>
                <span className="mx-1">•</span>
                <Phone className="mr-1 h-3 w-3" />
                <span>
                  {formatPhoneNumber(
                    customer.countryCode,
                    customer.phoneNumber,
                  )}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "intervalMonths",
      header: "Interval",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("intervalMonths")} Months</span>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span
          className="text-sm text-slate-500 truncate max-w-[200px]"
          title={row.getValue("notes")}
        >
          {row.getValue("notes") || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendReminder(service.id)}
              disabled={sendReminder.isPending}
            >
              <Send className="mr-2 h-3 w-3" /> Send
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                router.push(`/admin/vehicles/${service.vehicleId}/history`)
              }
            >
              <Eye className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Services"
          description="Track and manage all vehicle services"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Services" },
          ]}
        />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Services" }]} />

      <PageHeader
        title="Services"
        description="Track and manage all vehicle services"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Services" },
        ]}
        actions={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Record Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Vehicle</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by plate or model..."
                      className="pl-9"
                      value={vehicleSearch}
                      onChange={(e) => {
                        setValue("vehicleId", "");
                        setVehicleSearch(e.target.value);
                      }}
                    />
                  </div>
                  {isVehiclesLoading && (
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Loading
                      vehicles...
                    </div>
                  )}
                  {filteredVehicles &&
                    filteredVehicles.length > 0 &&
                    vehicleSearch &&
                    !selectedVehicleId && (
                      <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-sm">
                        {filteredVehicles.map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            className={cn(
                              "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm",
                              selectedVehicleId === vehicle.id &&
                                "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
                            )}
                            onClick={() => {
                              setValue("vehicleId", vehicle.id);
                              setVehicleSearch(
                                `${vehicle.model} (${vehicle.numberPlate})`,
                              );
                            }}
                          >
                            <span className="font-medium">{vehicle.model}</span>
                            <span className="text-xs text-slate-500">
                              {vehicle.numberPlate}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  {errors.vehicleId && (
                    <p className="text-xs text-red-500">
                      Vehicle selection is required
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceDate" required>
                      Service Date
                    </Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      {...register("serviceDate")}
                    />
                    {errors.serviceDate && (
                      <p className="text-xs text-red-500">
                        {errors.serviceDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interval">Interval (Months)</Label>
                    <select
                      id="interval"
                      {...register("intervalMonths")}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                    >
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                    {errors.intervalMonths && (
                      <p className="text-xs text-red-500">
                        {errors.intervalMonths.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    {...register("notes")}
                    placeholder="e.g. Oil change and filter replacement"
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending
                      ? "Recording..."
                      : "Record Service"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={data || []}
        searchKey="serviceDate"
        loading={isLoading}
      />
    </div>
  );
}
