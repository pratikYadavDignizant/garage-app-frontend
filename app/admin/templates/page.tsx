"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Smartphone,
  MessageCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
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
  useTemplates,
  useCreateTemplate,
  Template,
} from "@/hooks/api/use-templates";

const templateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["WhatsApp", "Email", "SMS"]),
  content: z.string().min(5, "Content must be at least 5 characters"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function TemplatesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, isLoading } = useTemplates();
  const createMutation = useCreateTemplate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      type: "WhatsApp",
    },
  });

  const onSubmit = (values: TemplateFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setIsAddOpen(false);
        reset();
      },
    });
  };

  const columns: ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mr-3">
            <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const Icon =
          type === "WhatsApp"
            ? MessageCircle
            : type === "Email"
              ? Mail
              : Smartphone;
        return (
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Icon className="mr-2 h-4 w-4" />
            {type}
          </div>
        );
      },
    },
    {
      accessorKey: "content",
      header: "Preview",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500 line-clamp-1 max-w-xs">
          {row.getValue("content")}
        </span>
      ),
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.getValue("lastModified"))}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Templates" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Message Templates
          </h1>
          <p className="text-slate-500">
            Manage automated reminder messages for different channels.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" required>
                    Template Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. Oil Change Reminder"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Channel</Label>
                  <select
                    id="type"
                    {...register("type")}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" required>
                  Message Content
                </Label>
                <textarea
                  id="content"
                  {...register("content")}
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                  placeholder="Hi {{name}}, your vehicle {{model}} is due for service..."
                />
                {errors.content && (
                  <p className="text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        searchKey="name"
        loading={isLoading}
      />
    </div>
  );
}
