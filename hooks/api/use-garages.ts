import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Garage {
    id: string;
    name: string;
    phone?: string;
    countryCode?: string;
    phoneNumber?: string;
    address?: string;
    gstNumber?: string;
    isVerified?: boolean;
    isActive: boolean;
    createdAt?: string;
    ownerName?: string;
    email?: string;
    customersCount?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function useGarages(page = 1, limit = 20) {
    return useQuery<PaginatedResponse<Garage>>({
        queryKey: ['garages', page, limit],
        queryFn: async () => {
            const response = await api.get('/admin/garages', {
                params: { page, limit }
            });
            return response.data;
        },
    });
}

export function useGarage(id: string) {
    return useQuery<Garage>({
        queryKey: ['garage', id],
        queryFn: async () => {
            const response = await api.get(`/admin/garages/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useUpdateGarage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Garage> & { id: string }) => {
            const response = await api.put(`/admin/garages/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['garages'] });
            toast.success('Garage updated successfully');
        },
        onError: (error: any) => {
            const err = error.response?.data;
            const msg = err?.message ?? err?.error ?? 'Failed to update garage';
            toast.error(typeof msg === 'string' ? msg : 'Failed to update garage');
        },
    });
}

export interface DeletePreviewData {
    message: string;
    counts: {
        customers: number;
        vehicles: number;
        services: number;
        templates: number;
    };
    totalRecords: number;
    garageName?: string;
}

// Get deletion preview (Step 1)
export async function getDeletePreview(id: string): Promise<DeletePreviewData> {
    try {
        const response = await api.delete(`/admin/garages/${id}`);
        // If successful (no preview needed), return empty preview
        return {
            message: 'Delete garage?',
            counts: { customers: 0, vehicles: 0, services: 0, templates: 0 },
            totalRecords: 0,
        };
    } catch (error: any) {
        if (error.response?.status === 400 && error.response?.data?.counts) {
            // Return preview data
            return error.response.data;
        }
        throw error;
    }
}

// Confirm deletion (Step 2)
export function useDeleteGarage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/admin/garages/${id}?confirm=true`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['garages'] });
            toast.success('Garage and all related data permanently deleted');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete garage');
        },
    });
}

export function useCreateGarage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<Garage, 'id' | 'customersCount'>) => {
            const response = await api.post('/admin/garages', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['garages'] });
            toast.success('Garage created successfully');
        },
        onError: (error: any) => {
            const err = error.response?.data;
            const msg = err?.message ?? err?.error ?? 'Failed to create garage';
            toast.error(typeof msg === 'string' ? msg : 'Failed to create garage');
        },
    });
}

export function useToggleGarageStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const response = await api.patch(`/admin/garages/${id}/toggle`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['garages'] });
            toast.success('Garage status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update garage status');
        },
    });
}
