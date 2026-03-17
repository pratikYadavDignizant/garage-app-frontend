"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Car,
  User,
  Building2,
  Calendar,
  Download,
  Search,
  Loader2,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { formatDate, formatPhoneNumber } from "@/lib/format";
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
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  Vehicle,
} from "@/hooks/api/use-vehicles";
import { useSearchCustomers } from "@/hooks/api/use-customers";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  useEntityDelete,
  getEntityDeletePreview,
  EntityDeletePreview,
} from "@/hooks/api/use-entity-delete";
import { numberPlateSchema, vehicleModelSchema } from "@/lib/validations/vehicle";

const vehicleSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  model: vehicleModelSchema,
  numberPlate: numberPlateSchema,
  defaultOilIntervalMonths: z.enum(["1", "2", "3", "6"]).transform(Number),
});

type VehicleFormValues = {
  customerId: string;
  model: string;
  numberPlate: string;
  defaultOilIntervalMonths: string;
};

export default function VehiclesPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePreview, setDeletePreview] =
    useState<EntityDeletePreview | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const { data, isLoading } = useVehicles();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useEntityDelete("vehicles", ["vehicles"]);
  const { data: searchResults, isLoading: isSearching } =
    useSearchCustomers(customerSearch);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema as any),
    mode: "onChange",
    defaultValues: {
      defaultOilIntervalMonths: "6",
    },
  });

  const selectedCustomerId = watch("customerId");

  const onSubmit = (values: VehicleFormValues) => {
    const payload = {
      ...values,
      defaultOilIntervalMonths: Number(values.defaultOilIntervalMonths),
    };

    if (currentVehicle) {
      updateMutation.mutate(
        { id: currentVehicle.id, ...payload },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setCurrentVehicle(null);
            reset();
            setCustomerSearch("");
          },
        },
      );
    } else {
      // @ts-ignore - vehicle payload doesn't need id
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsAddOpen(false);
          reset();
          setCustomerSearch("");
        },
      });
    }
  };

  const openAdd = () => {
    setCurrentVehicle(null);
    reset({
      customerId: "",
      model: "",
      numberPlate: "",
      defaultOilIntervalMonths: "6",
    });
    setCustomerSearch("");
    setIsAddOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    reset({
      customerId: String(vehicle.customerId),
      model: vehicle.model,
      numberPlate: vehicle.numberPlate,
      defaultOilIntervalMonths: String(vehicle.defaultOilIntervalMonths),
    });
    setCustomerSearch(vehicle.customer?.name || "");
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string, vehicleName: string) => {
    try {
      const preview = await getEntityDeletePreview("vehicles", id);
      setDeletePreview({ ...preview, entityName: vehicleName });
      setVehicleToDelete(id);
      setDeleteModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to get deletion preview",
      );
    }
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteMutation.mutate(vehicleToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setVehicleToDelete(null);
          setDeletePreview(null);
        },
      });
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "model",
      header: "Vehicle",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mr-3">
            <Car className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {row.original.model}
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wider">
              {row.original.numberPlate}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div className="flex flex-col">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <User className="mr-2 h-4 w-4 text-slate-400" />
              {customer?.name || "N/A"}
            </div>
            {customer && (customer.countryCode || customer.phoneNumber) && (
              <span className="text-xs text-slate-500 ml-6">
                {formatPhoneNumber(customer.countryCode, customer.phoneNumber)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "defaultOilIntervalMonths",
      header: "Interval",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("defaultOilIntervalMonths")} Months
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Added On",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEdit(vehicle)}
            >
              <Pencil className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                router.push(`/admin/vehicles/${vehicle.id}/history`)
              }
            >
              <Eye className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDelete(vehicle.id, `${vehicle.model} (${vehicle.numberPlate})`)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
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
          title="Vehicles"
          description="View and manage all registered vehicles"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Vehicles" },
          ]}
        />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Vehicles" }]} />

      <PageHeader
        title="Vehicles"
        description="View and manage all registered vehicles"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Vehicles" },
        ]}
        actions={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="model"
        loading={isLoading}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        previewData={deletePreview}
        isLoading={deleteMutation.isPending}
        entityType="Vehicle"
      />

      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label required>Assign Customer</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or phone..."
                  className="pl-9"
                  value={customerSearch}
                  onChange={(e) => {
                    if (selectedCustomerId) {
                      setValue("customerId", "");
                    }
                    setCustomerSearch(e.target.value);
                  }}
                  disabled={!!selectedCustomerId}
                />
                {selectedCustomerId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setValue("customerId", "");
                      setCustomerSearch("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isSearching && (
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Searching...
                </div>
              )}
              {searchResults &&
                searchResults.length > 0 &&
                customerSearch &&
                !selectedCustomerId && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-sm">
                    {searchResults.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        className={cn(
                          "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 rounded-sm",
                          selectedCustomerId === customer.id &&
                            "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
                        )}
                        onClick={() => {
                          setValue("customerId", customer.id);
                          setCustomerSearch(customer.name);
                        }}
                      >
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-slate-500">
                          {formatPhoneNumber(
                            customer.countryCode,
                            customer.phoneNumber,
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              {errors.customerId && (
                <p className="text-xs text-red-500">
                  {errors.customerId.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model" required>
                  Vehicle Model
                </Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g. Maruti Swift or Honda City 2024"
                  className={cn(
                    errors.model && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.model && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.model.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberPlate" required>
                  Number Plate
                </Label>
                <Input
                  id="numberPlate"
                  {...register("numberPlate")}
                  placeholder="e.g. KA-01-AB-1234"
                  className={cn(
                    errors.numberPlate && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.numberPlate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.numberPlate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Oil Service Interval</Label>
              <select
                id="interval"
                {...register("defaultOilIntervalMonths")}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
              >
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
              </select>
              {errors.defaultOilIntervalMonths && (
                <p className="text-xs text-red-500">
                  {errors.defaultOilIntervalMonths.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setIsEditOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditOpen
                    ? "Save Changes"
                    : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
