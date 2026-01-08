import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import type {
    RegistrationRequestData,
    RegistrationRequestResponse,
    RegistrationStatusResponse,
    AdminRegistrationRequestsResponse,
    AdminRegistrationRequest,
    ApproveRequestResponse,
    RejectRequestData,
    ApiResponse,
    ApiErrorResponse,
} from '@/lib/types/registration';
import type { AxiosError } from 'axios';

// ============================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================

/**
 * Submit a new registration request
 */
export function useSubmitRegistration() {
    return useMutation<RegistrationRequestResponse, AxiosError<ApiErrorResponse>, RegistrationRequestData>({
        mutationFn: async (data) => {
            const response = await api.post('/registration/request', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Registration request submitted successfully!');
        },
        onError: (error) => {
            const status = error.response?.status;
            const errorMessage = error.response?.data?.error;

            if (status === 409) {
                toast.error(errorMessage || 'Phone number already registered or pending approval');
            } else if (status === 429) {
                toast.error(errorMessage || 'Too many requests. Please try again in 24 hours');
            } else {
                toast.error(errorMessage || 'Failed to submit registration request');
            }
        },
    });
}

/**
 * Check registration status for a phone number
 */
export function useCheckRegistrationStatus(phoneNumber: string, countryCode: string, enabled = false) {
    return useQuery<RegistrationStatusResponse, AxiosError<ApiErrorResponse>>({
        queryKey: ['registration-status', phoneNumber, countryCode],
        queryFn: async () => {
            const response = await api.get(`/registration/status/${phoneNumber}`, {
                params: { countryCode },
            });
            return response.data;
        },
        enabled: enabled && !!phoneNumber && phoneNumber.length === 10,
        retry: false,
    });
}

// ============================================
// ADMIN ENDPOINTS (Auth Required)
// ============================================

/**
 * Get list of registration requests with filtering and pagination
 */
export function useRegistrationRequests(
    status?: string,
    page: number = 1,
    limit: number = 20
) {
    return useQuery<
        { requests: AdminRegistrationRequest[]; total: number; page: number; limit: number },
        AxiosError<ApiErrorResponse>
    >({
        queryKey: ['registration-requests', status, page, limit],
        queryFn: async () => {
            const response = await api.get<AdminRegistrationRequestsResponse>('/admin/registration-requests', {
                params: {
                    ...(status && status !== 'ALL' && { status }),
                    page,
                    limit,
                },
            });

            // Transform the response to match the expected structure
            return {
                requests: response.data.data,
                total: response.data.pagination.total,
                page: response.data.pagination.page,
                limit: response.data.pagination.limit,
            };
        },
        staleTime: 30 * 1000, // 30 seconds
    });
}

/**
 * Get single registration request details
 */
export function useRegistrationRequest(id: string, enabled = true) {
    return useQuery<AdminRegistrationRequest, AxiosError<ApiErrorResponse>>({
        queryKey: ['registration-request', id],
        queryFn: async () => {
            const response = await api.get(`/admin/registration-requests/${id}`);
            return response.data;
        },
        enabled: enabled && !!id,
    });
}

/**
 * Approve a registration request
 */
export function useApproveRequest() {
    const queryClient = useQueryClient();

    return useMutation<ApproveRequestResponse, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (id) => {
            const response = await api.post(`/admin/registration-requests/${id}/approve`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
            queryClient.invalidateQueries({ queryKey: ['registration-request'] });
            toast.success(data.message || `Garage account created for ${data.garage.name}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to approve request');
        },
    });
}

/**
 * Reject a registration request with reason
 */
export function useRejectRequest() {
    const queryClient = useQueryClient();

    return useMutation<
        ApiResponse,
        AxiosError<ApiErrorResponse>,
        { id: string; data: RejectRequestData }
    >({
        mutationFn: async ({ id, data }) => {
            const response = await api.post(`/admin/registration-requests/${id}/reject`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
            queryClient.invalidateQueries({ queryKey: ['registration-request'] });
            toast.success(data.message || 'Registration request rejected');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to reject request');
        },
    });
}

/**
 * Delete a rejected registration request
 */
export function useDeleteRequest() {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (id) => {
            const response = await api.delete(`/admin/registration-requests/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
            toast.success(data.message || 'Registration request deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete request');
        },
    });
}
