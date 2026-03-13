"use client";

import { useState } from "react";
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
  Power,
  PowerOff,
  Building2,
  Download,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  useGarages,
  useUpdateGarage,
  useCreateGarage,
  useToggleGarageStatus,
  Garage,
} from "@/hooks/api/use-garages";
import { phoneFieldsSchema } from "@/lib/validations/phone";
import {
  useEntityDelete,
  getEntityDeletePreview,
  EntityDeletePreview,
} from "@/hooks/api/use-entity-delete";

const garageSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().optional(),
    gstNumber: z.string().optional(),
  })
  .and(phoneFieldsSchema);

type GarageFormValues = z.infer<typeof garageSchema>;

export default function GaragesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentGarage, setCurrentGarage] = useState<Garage | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePreview, setDeletePreview] =
    useState<EntityDeletePreview | null>(null);
  const [garageToDelete, setGarageToDelete] = useState<string | null>(null);

  const { data, isLoading } = useGarages();
  const updateGarage = useUpdateGarage();
  const deleteMutation = useEntityDelete("garages", ["garages"]);
  const createMutation = useCreateGarage();
  const toggleStatus = useToggleGarageStatus();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm<GarageFormValues>({
    resolver: zodResolver(garageSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
    },
  });

  const countryCode = watch("countryCode");
  const phoneNumber = watch("phoneNumber");

  const onSubmit = (values: GarageFormValues) => {
    if (currentGarage) {
      updateGarage.mutate(
        { id: currentGarage.id, ...values },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setCurrentGarage(null);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(
        { ...values, isActive: true },
        {
          onSuccess: () => {
            setIsAddOpen(false);
            reset();
          },
        },
      );
    }
  };

  const openEdit = (garage: Garage) => {
    setCurrentGarage(garage);
    reset({
      name: garage.name,
      countryCode: garage.countryCode || "+91",
      phoneNumber:
        garage.phoneNumber || garage.phone?.replace(/^\+\d{1,4}/, "") || "",
      address: garage.address || "",
      gstNumber: garage.gstNumber || "",
    });
    setIsEditOpen(true);
  };

  const openAdd = () => {
    setCurrentGarage(null);
    reset({
      name: "",
      countryCode: "+91",
      phoneNumber: "",
      address: "",
      gstNumber: "",
    });
    setIsAddOpen(true);
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    toggleStatus.mutate({ id, isActive: !currentStatus });
  };

  const handleDelete = async (id: string, garageName: string) => {
    try {
      const preview = await getEntityDeletePreview("garages", id);
      setDeletePreview({ ...preview, entityName: garageName });
      setGarageToDelete(id);
      setDeleteModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to get deletion preview",
      );
    }
  };

  const confirmDelete = () => {
    if (garageToDelete) {
      deleteMutation.mutate(garageToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setGarageToDelete(null);
          setDeletePreview(null);
        },
      });
    }
  };

  const columns: ColumnDef<Garage>[] = [
    {
      accessorKey: "name",
      header: "Garage Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mr-3">
            <Building2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const garage = row.original;
        const phoneNumber =
          garage.countryCode && garage.phoneNumber
            ? `${garage.countryCode} ${garage.phoneNumber}`
            : garage.phone || "N/A";

        return (
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Phone className="mr-2 h-4 w-4" />
            {phoneNumber}
          </div>
        );
      },
    },
    {
      accessorKey: "gstNumber",
      header: "GST Number",
      cell: ({ row }) => row.getValue("gstNumber") || "N/A",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <span
          className="text-sm text-slate-500 truncate max-w-[200px]"
          title={row.getValue("address")}
        >
          {row.getValue("address") || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => {
        const isVerified = row.getValue("isVerified") as boolean;
        return (
          <Badge
            variant={isVerified ? "success" : "outline"}
            className={isVerified ? "" : "text-slate-400 border-slate-200"}
          >
            {isVerified ? "Verified" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "success" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return formatDate(date);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const garage = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEdit(garage)}
            >
              <Pencil className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toggleActive(garage.id, !!garage.isActive)}
              disabled={toggleStatus.isPending}
            >
              {garage.isActive ? (
                <PowerOff className="h-4 w-4 text-amber-500" />
              ) : (
                <Power className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDelete(garage.id, garage.name)}
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
          title="Garages"
          description="Manage your partner garages and their accounts"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Garages" },
          ]}
        />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Garages" }]} />

      <PageHeader
        title="Garages"
        description="Manage your partner garages and their accounts"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Garages" },
        ]}
        actions={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Garage
          </Button>
        }
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Garage" : "Add New Garage"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" required>
                Garage Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. City Auto Care"
                  className={cn(
                    errors.name && "border-red-500 focus-visible:ring-red-500",
                    !errors.name &&
                      touchedFields.name &&
                      watch("name") &&
                      "border-green-500 focus-visible:ring-green-500",
                  )}
                  onKeyPress={(e) => {
                    if (!/[a-zA-Z\s\-']/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {!errors.name && touchedFields.name && watch("name") && (
                  <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>
            <PhoneInput
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onCountryCodeChange={(value) => setValue("countryCode", value)}
              onPhoneNumberChange={(value) => setValue("phoneNumber", value)}
              countryCodeError={errors.countryCode?.message}
              phoneNumberError={errors.phoneNumber?.message}
            />
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="e.g. MG Road, Bangalore"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                {...register("gstNumber")}
                placeholder="e.g. 29ABCDE1234F1ZO"
              />
            </div>
            <DialogFooter>
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
                disabled={createMutation.isPending || updateGarage.isPending}
              >
                {createMutation.isPending || updateGarage.isPending
                  ? "Saving..."
                  : isEditOpen
                    ? "Save Changes"
                    : "Add Garage"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        previewData={deletePreview}
        isLoading={deleteMutation.isPending}
        entityType="Garage"
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        loading={isLoading}
      />
    </div>
  );
}
