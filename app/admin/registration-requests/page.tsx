"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ApproveDialog } from "@/components/registration/approve-dialog";
import { RejectModal } from "@/components/registration/reject-modal";
import { RequestDetailsModal } from "@/components/registration/request-details-modal";
import {
  useRegistrationRequests,
  useDeleteRequest,
} from "@/hooks/api/use-registration";
import type {
  AdminRegistrationRequest,
  RegistrationStatus,
} from "@/lib/types/registration";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type TabStatus = "ALL" | RegistrationStatus;

export default function RegistrationRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRegistrationRequest | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Fetch data for active tab
  const { data, isLoading } = useRegistrationRequests(
    activeTab === "ALL" ? undefined : activeTab,
    currentPage,
    20,
  );

  // Fetch counts for all tabs (just get first page to get total count)
  const { data: allData } = useRegistrationRequests(undefined, 1, 1);
  const { data: pendingData } = useRegistrationRequests("PENDING", 1, 1);
  const { data: approvedData } = useRegistrationRequests("APPROVED", 1, 1);
  const { data: rejectedData } = useRegistrationRequests("REJECTED", 1, 1);

  const deleteRequest = useDeleteRequest();

  const tabs: { label: string; value: TabStatus; count?: number }[] = [
    { label: "All", value: "ALL", count: allData?.total || 0 },
    { label: "Pending", value: "PENDING", count: pendingData?.total || 0 },
    { label: "Approved", value: "APPROVED", count: approvedData?.total || 0 },
    { label: "Rejected", value: "REJECTED", count: rejectedData?.total || 0 },
  ];

  const handleApprove = (request: AdminRegistrationRequest) => {
    setSelectedRequest(request);
    setApproveDialogOpen(true);
  };

  const handleReject = (request: AdminRegistrationRequest) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const handleDelete = async (request: AdminRegistrationRequest) => {
    if (request.status !== "REJECTED") {
      toast.error("Only rejected requests can be deleted");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the request from ${request.name}?`,
      )
    ) {
      await deleteRequest.mutateAsync(request.id);
    }
  };

  const handleViewDetails = (request: AdminRegistrationRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      header: "Garage Name",
      accessorKey: "name",
      cell: ({ row }: { row: { original: AdminRegistrationRequest } }) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {row.original.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.original.countryCode} {row.original.phoneNumber}
          </p>
        </div>
      ),
    },
    {
      header: "Requested Date",
      accessorKey: "requestedAt",
      cell: ({ row }: { row: { original: AdminRegistrationRequest } }) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {format(new Date(row.original.requestedAt), "PPp")}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: AdminRegistrationRequest } }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: AdminRegistrationRequest } }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleViewDetails(row.original)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {row.original.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleApprove(row.original)}
                className="text-green-600 hover:text-green-700 dark:text-green-400"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReject(row.original)}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}

          {row.original.status === "REJECTED" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(row.original)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
              title="Delete"
              disabled={deleteRequest.isPending}
            >
              {deleteRequest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration Requests"
        description="Manage garage registration requests and approvals"
        icon={UserPlus}
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={`
                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                ${
                  activeTab === tab.value
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }
              `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : !data || !data.requests || data.requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={`No ${activeTab.toLowerCase()} requests`}
          description={
            activeTab === "PENDING"
              ? "New registration requests will appear here"
              : `No ${activeTab.toLowerCase()} registration requests found`
          }
        />
      ) : (
        <>
          <DataTable data={data.requests} columns={columns} />

          {/* Pagination */}
          {data.total > 20 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {(currentPage - 1) * 20 + 1} to{" "}
                {Math.min(currentPage * 20, data.total)} of {data.total}{" "}
                requests
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage * 20 >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {selectedRequest && (
        <>
          <ApproveDialog
            requestId={selectedRequest.id}
            garageName={selectedRequest.name}
            phoneNumber={`${selectedRequest.countryCode} ${selectedRequest.phoneNumber}`}
            isOpen={approveDialogOpen}
            onClose={() => {
              setApproveDialogOpen(false);
              setSelectedRequest(null);
            }}
          />

          <RejectModal
            requestId={selectedRequest.id}
            garageName={selectedRequest.name}
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedRequest(null);
            }}
          />

          <RequestDetailsModal
            request={selectedRequest}
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedRequest(null);
            }}
          />
        </>
      )}
    </div>
  );
}
