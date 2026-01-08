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
import { AlertTriangle } from "lucide-react";

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

  const hasChildren = previewData.totalRecords && previewData.totalRecords > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Permanent Deletion Warning</DialogTitle>
          </div>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-slate-900 dark:text-slate-100 font-medium">
              {previewData.message}
            </p>

            {hasChildren && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 space-y-2">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  This will permanently delete:
                </p>
                <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                  {previewData.entityName && (
                    <li>
                      • {entityType}: <strong>{previewData.entityName}</strong>
                    </li>
                  )}
                  {previewData.entityDetails &&
                    Object.entries(previewData.entityDetails).map(
                      ([key, value]) => (
                        <li key={key}>
                          • {key}: <strong>{value}</strong>
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
                  <p className="text-sm font-bold text-red-900 dark:text-red-100">
                    Total: {previewData.totalRecords} records
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">
                This action CANNOT be undone!
              </p>
            </div>
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
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : hasChildren ? "Delete All" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
