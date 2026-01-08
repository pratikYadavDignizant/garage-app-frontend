"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useApproveRequest } from "@/hooks/api/use-registration";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ApproveDialogProps {
  requestId: string;
  garageName: string;
  phoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApproveDialog({
  requestId,
  garageName,
  phoneNumber,
  isOpen,
  onClose,
}: ApproveDialogProps) {
  const approveRequest = useApproveRequest();

  const handleApprove = async () => {
    await approveRequest.mutateAsync(requestId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle>Approve Registration Request</DialogTitle>
              <DialogDescription>
                This action will create a garage account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Garage Name:
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {garageName}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Phone Number:
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {phoneNumber}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Button
            onClick={handleApprove}
            disabled={approveRequest.isPending}
            className="flex-1"
          >
            {approveRequest.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Confirm Approval"
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={approveRequest.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
