"use client";

import { exportToCSV } from "@/lib/export";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Phone,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  Customer,
} from "@/hooks/api/use-customers";
import { useGarages } from "@/hooks/api/use-garages";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  useEntityDelete,
  getEntityDeletePreview,
  EntityDeletePreview,
} from "@/hooks/api/use-entity-delete";
import { phoneFieldsSchema } from "@/lib/validations/phone";
import { customerNameSchema } from "@/lib/validations/customer";

const customerSchema = z
  .object({
    name: customerNameSchema,
    address: z.string().trim().max(500, "Address must be less than 500 characters").optional(),
    garageId: z.string().min(1, "Please select a garage"),
  })
  .and(phoneFieldsSchema);

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePreview, setDeletePreview] =
    useState<EntityDeletePreview | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const { data, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useEntityDelete("customers", ["customers"]);
  const { data: garagesData } = useGarages(1, 100);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onTouched",
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
      garageId: "",
    },
  });

  const countryCode = watch("countryCode");
  const phoneNumber = watch("phoneNumber");

  const onSubmit = (values: CustomerFormValues) => {
    // Sanitize garageId: remove if empty string to avoid sending invalid data
    const payload = {
      ...values,
      garageId: values.garageId || undefined,
    };

    if (currentCustomer) {
      updateMutation.mutate(
        { id: currentCustomer.id, ...payload },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setCurrentCustomer(null);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsAddOpen(false);
          reset();
        },
      });
    }
  };

  const openAdd = () => {
    setCurrentCustomer(null);
    reset({
      name: "",
      countryCode: "+91",
      phoneNumber: "",
      address: "",
      garageId: "",
    });
    setIsAddOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    reset({
      name: customer.name,
      countryCode: customer.countryCode || "+91",
      phoneNumber:
        customer.phoneNumber || customer.phone?.replace(/^\+\d{1,4}/, "") || "",
      address: customer.address || "",
      garageId: customer.garageId || "",
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string, customerName: string) => {
    try {
      const preview = await getEntityDeletePreview("customers", id);
      setDeletePreview({ ...preview, entityName: customerName });
      setCustomerToDelete(id);
      setDeleteModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to get deletion preview",
      );
    }
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
          setDeletePreview(null);
        },
      });
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const customer = row.original;
        const phoneNumber =
          customer.countryCode && customer.phoneNumber
            ? `${customer.countryCode} ${customer.phoneNumber}`
            : customer.phone || "N/A";

        return (
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Phone className="mr-2 h-4 w-4" />
            {phoneNumber}
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div
          className="text-sm text-slate-500 max-w-[200px] truncate"
          title={row.getValue("address") || "N/A"}
        >
          {row.getValue("address") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Added",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return formatDate(date);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEdit(customer)}
            >
              <Pencil className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDelete(customer.id, customer.name)}
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
          title="Customers"
          description="Manage your customer database and communication"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Customers" },
          ]}
        />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Customers" }]} />

      <PageHeader
        title="Customers"
        description="Manage your customer database and communication"
        actions={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        loading={isLoading}
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
              {isEditOpen ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" required>
                Customer Name
              </Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Rushabh Rane or V. Kumar"
                  className={cn(
                    errors.name && "border-red-500 focus-visible:ring-red-500",
                    !errors.name &&
                      touchedFields.name &&
                      watch("name") &&
                      "border-green-500 focus-visible:ring-green-500 pr-10",
                  )}
                />
                {!errors.name && touchedFields.name && watch("name") && (
                  <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
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
              <Textarea
                id="address"
                {...register("address")}
                placeholder="e.g. 123 Street, City"
                rows={3}
                className={cn(
                  errors.address && "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {errors.address && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="garageId" required>Assigned Garage</Label>
              <select
                id="garageId"
                {...register("garageId")}
                className={cn(
                  "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-slate-300 overflow-hidden text-ellipsis",
                  errors.garageId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 focus:ring-slate-950 dark:border-slate-800",
                )}
              >
                <option value="">Select a garage...</option>
                {garagesData?.data?.map((garage) => (
                  <option key={garage.id} value={garage.id}>
                    {garage.name.length > 40 ? `${garage.name.slice(0, 40)}...` : garage.name}
                  </option>
                ))}
              </select>
              {errors.garageId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.garageId.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={createMutation.isPending || updateMutation.isPending}
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
                    : "Add Customer"}
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
        entityType="Customer"
      />
    </div>
  );
}
