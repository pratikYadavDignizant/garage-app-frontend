"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
  X,
  IndianRupee,
  ShoppingCart,
  Clock,
  Trash2,
  FileText,
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
  ServiceItem,
  calculateTotalCost,
} from "@/hooks/api/use-services";
import { useSendInvoice } from "@/hooks/api/use-invoices";
import { useVehicles } from "@/hooks/api/use-vehicles";

const serviceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceDate: z.string().min(1, "Service date is required"),
  intervalMonths: z.enum(["1", "2", "3", "6"]).transform(Number),
  serviceItems: z
    .array(
      z.object({
        service: z.string().min(1, "Service name is required"),
        cost: z.number().min(0, "Cost must be positive"),
      }),
    )
    .min(1, "At least one service item is required"),
  notes: z.string().optional(),
});

type ServiceFormValues = {
  vehicleId: string;
  serviceDate: string;
  intervalMonths: string;
  serviceItems: { service: string; cost: number }[];
  notes?: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const { data, isLoading } = useServices();
  const createMutation = useCreateService();
  const sendInvoice = useSendInvoice();

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
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema as any),
    defaultValues: {
      serviceDate: format(new Date(), "yyyy-MM-dd"),
      intervalMonths: "6",
      serviceItems: [{ service: "", cost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceItems",
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

  const handleSendInvoice = (serviceId: string) => {
    sendInvoice.mutate(serviceId);
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "serviceDate",
      header: "Service Date",
      cell: ({ row }) => {
        const date = row.getValue("serviceDate") as string;
        const nextDate = row.original.nextServiceDate;
        return (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              {date
                ? new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
            <div className="flex items-center text-xs text-slate-500 ml-6">
              <Clock className="mr-1.5 h-3 w-3" />
              Next:{" "}
              {nextDate
                ? new Date(nextDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
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
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <Car className="mr-2 h-4 w-4 text-slate-400" />
              <span>{vehicle?.model || "N/A"}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono ml-6">
              {vehicle?.numberPlate || "N/A"}
            </span>
            {customer && (
              <div className="text-xs text-slate-500 ml-6 truncate max-w-[200px]">
                {customer.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "serviceItems",
      header: "Service Summary",
      cell: ({ row }) => {
        const items = row.getValue("serviceItems") as ServiceItem[];
        const totalCost = items ? calculateTotalCost(items) : 0;
        const interval = row.original.intervalMonths;

        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs font-normal">
                <ShoppingCart className="mr-1 h-3 w-3" />
                {items?.length || 0} items
              </Badge>
              <Badge variant="secondary" className="text-xs font-normal">
                {interval}mo interval
              </Badge>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              ₹{totalCost.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/invoice/${service.id}`, "_blank")}
              className="h-8"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendInvoice(service.id)}
              disabled={sendInvoice.isPending}
              className="h-8"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Send Invoice
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Record New Service
                </DialogTitle>
                <p className="text-sm text-slate-500">
                  Add service details and items for a vehicle
                </p>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Vehicle Selection Card */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Car className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-semibold">
                      Vehicle Selection
                    </Label>
                  </div>
                  <div className="space-y-2">
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
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />{" "}
                        Loading vehicles...
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
                                "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm transition-colors",
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
                              <span className="font-medium">
                                {vehicle.model}
                              </span>
                              <span className="text-xs text-slate-500">
                                {vehicle.numberPlate}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    {errors.vehicleId && (
                      <p className="text-xs text-red-500">
                        {errors.vehicleId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Details Card */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-semibold">
                      Service Details
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceDate" className="text-xs">
                        Service Date *
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
                      <Label htmlFor="interval" className="text-xs">
                        Interval (Months)
                      </Label>
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
                    </div>
                  </div>
                </div>

                {/* Service Items Card */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                      <Label className="text-sm font-semibold">
                        Service Items *
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ service: "", cost: 0 })}
                      className="h-8"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Item
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-2 items-start p-3 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Service name (e.g., Oil change)"
                            {...register(`serviceItems.${index}.service`)}
                            className="h-9"
                          />
                          {errors.serviceItems?.[index]?.service && (
                            <p className="text-xs text-red-500">
                              {errors.serviceItems[index]?.service?.message}
                            </p>
                          )}
                        </div>
                        <div className="w-28 space-y-1">
                          <Input
                            type="number"
                            placeholder="Cost"
                            {...register(`serviceItems.${index}.cost`, {
                              valueAsNumber: true,
                            })}
                            className="h-9"
                          />
                          {errors.serviceItems?.[index]?.cost && (
                            <p className="text-xs text-red-500">
                              {errors.serviceItems[index]?.cost?.message}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {errors.serviceItems &&
                    typeof errors.serviceItems.message === "string" && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.serviceItems.message}
                      </p>
                    )}

                  {/* Total Cost Display */}
                  {fields.length > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Cost
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        ₹
                        {fields
                          .reduce((sum, _, idx) => {
                            const cost = watch(`serviceItems.${idx}.cost`);
                            return sum + (Number(cost) || 0);
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes Card */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-semibold mb-2 block"
                  >
                    Additional Notes (Optional)
                  </Label>
                  <Input
                    id="notes"
                    {...register("notes")}
                    placeholder="e.g. Customer requested premium oil"
                  />
                </div>

                <DialogFooter className="pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddOpen(false);
                      reset();
                      setVehicleSearch("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      "Record Service"
                    )}
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
