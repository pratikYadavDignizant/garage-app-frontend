"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import type { AdminRegistrationRequest } from "@/lib/types/registration";
import {
  Phone,
  Store,
  MapPin,
  FileText,
  Mail,
  Calendar,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface RequestDetailsModalProps {
  request: AdminRegistrationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestDetailsModal({
  request,
  isOpen,
  onClose,
}: RequestDetailsModalProps) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration Request Details</DialogTitle>
          <DialogDescription>Request ID: {request.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Status
            </label>
            <div className="mt-1">
              <StatusBadge status={request.status} size="lg" />
            </div>
          </div>

          {/* Garage Information */}
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Garage Information
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <Store className="h-4 w-4" />
                  <span className="text-xs font-medium">Garage Name</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {request.name}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs font-medium">Phone Number</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {request.countryCode} {request.phoneNumber}
                </p>
              </div>

              {request.address && (
                <div className="sm:col-span-2">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">Address</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {request.address}
                  </p>
                </div>
              )}

              {request.gstNumber && (
                <div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium">GST Number</span>
                  </div>
                  <p className="mt-1 text-sm font-mono text-slate-900 dark:text-slate-100">
                    {request.gstNumber}
                  </p>
                </div>
              )}

              {request.email && (
                <div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {request.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Timeline
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">Requested At</span>
                </div>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {format(new Date(request.requestedAt), "PPpp")}
                </p>
              </div>

              {request.reviewedAt && (
                <div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium">Reviewed At</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {format(new Date(request.reviewedAt), "PPpp")}
                  </p>
                </div>
              )}

              {request.reviewerId && (
                <div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium">Reviewer ID</span>
                  </div>
                  <p className="mt-1 text-sm font-mono text-slate-900 dark:text-slate-100">
                    {request.reviewerId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {request.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <h4 className="font-semibold text-red-900 dark:text-red-400">
                Rejection Reason
              </h4>
              <p className="mt-2 text-sm text-red-800 dark:text-red-300">
                {request.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
