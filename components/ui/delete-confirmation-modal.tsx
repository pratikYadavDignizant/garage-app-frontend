import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface EntityDeletePreview {
  message: string;
  counts?: {
    customers?: number;
    vehicles?: number;
    services?: number;
    templates?: number;
  };
  totalRecords?: number;
  entityName?: string;
  entityDetails?: Record<string, any>;
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  previewData: EntityDeletePreview | null;
  isLoading?: boolean;
  entityType?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  previewData,
  isLoading,
  entityType = "item",
}: DeleteConfirmationModalProps) {
  if (!previewData) return null;

  const hasChildren = (previewData.totalRecords ?? 0) > 0;

  // Simple confirmation for entities with no related data
  if (!hasChildren) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-slate-500" />
              <DialogTitle>Delete {entityType}</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {previewData.entityName ? (
                <span>
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {previewData.entityName}
                  </strong>
                  ?
                </span>
              ) : (
                <span>Are you sure you want to delete this {entityType.toLowerCase()}?</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Full cascade warning for entities with related data
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Permanent Deletion Warning</DialogTitle>
          </div>
          <div className="space-y-4 pt-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 space-y-2">
              <p className="font-medium text-red-900 dark:text-red-100">
                This will permanently delete:
              </p>
              <ul className="space-y-1 text-red-800 dark:text-red-200">
                {previewData.entityName && (
                  <li>
                    • {entityType}: <strong>{previewData.entityName}</strong>
                  </li>
                )}
                {previewData.entityDetails &&
                  Object.entries(previewData.entityDetails).map(
                    ([key, value]) => (
                      <li key={key}>
                        • {key}: <strong>{String(value)}</strong>
                      </li>
                    ),
                  )}
                {previewData.counts?.customers !== undefined &&
                  previewData.counts.customers > 0 && (
                    <li>
                      • <strong>{previewData.counts.customers}</strong>{" "}
                      Customers
                    </li>
                  )}
                {previewData.counts?.vehicles !== undefined &&
                  previewData.counts.vehicles > 0 && (
                    <li>
                      • <strong>{previewData.counts.vehicles}</strong>{" "}
                      Vehicles
                    </li>
                  )}
                {previewData.counts?.services !== undefined &&
                  previewData.counts.services > 0 && (
                    <li>
                      • <strong>{previewData.counts.services}</strong>{" "}
                      Services
                    </li>
                  )}
                {previewData.counts?.templates !== undefined &&
                  previewData.counts.templates > 0 && (
                    <li>
                      • <strong>{previewData.counts.templates}</strong>{" "}
                      Templates
                    </li>
                  )}
              </ul>
              <div className="pt-2 border-t border-red-200 dark:border-red-800">
                <p className="font-bold text-red-900 dark:text-red-100">
                  Total: {previewData.totalRecords} records
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : "Delete All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
