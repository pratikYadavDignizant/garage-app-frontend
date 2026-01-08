"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRejectRequest } from "@/hooks/api/use-registration";
import {
  rejectReasonSchema,
  type RejectReasonFormData,
} from "@/lib/validations/registration";
import { XCircle, Loader2 } from "lucide-react";

interface RejectModalProps {
  requestId: string;
  garageName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RejectModal({
  requestId,
  garageName,
  isOpen,
  onClose,
}: RejectModalProps) {
  const rejectRequest = useRejectRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RejectReasonFormData>({
    resolver: zodResolver(rejectReasonSchema),
  });

  const reason = watch("reason") || "";

  const onSubmit = async (data: RejectReasonFormData) => {
    await rejectRequest.mutateAsync({ id: requestId, data });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Reject Registration Request</DialogTitle>
              <DialogDescription>
                Provide a reason for rejection
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {garageName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="reason"
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Please provide a clear reason for rejecting this registration..."
              {...register("reason")}
              disabled={rejectRequest.isPending}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.reason && (
                <p className="text-xs text-red-500">{errors.reason.message}</p>
              )}
              <p className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                {reason.length}/500
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={rejectRequest.isPending}
              variant="destructive"
              className="flex-1"
            >
              {rejectRequest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={rejectRequest.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
