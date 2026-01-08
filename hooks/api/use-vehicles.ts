import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Vehicle {
    id: string;
    customerId: string;
    model: string;
    numberPlate: string;
    defaultOilIntervalMonths: number;
    createdAt?: string;
    customer?: {
        id: string;
        name: string;
        countryCode: string;
        phoneNumber: string;
        address?: string;
    };
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

export function useVehicles(customerId?: string, page = 1, limit = 20) {
    return useQuery<PaginatedResponse<Vehicle>>({
        queryKey: ['vehicles', customerId, page, limit],
        queryFn: async () => {
            const response = await api.get('/admin/vehicles', {
                params: { customerId, page, limit }
            });
            return response.data;
        },
    });
}

export function useVehicle(id: string) {
    return useQuery<Vehicle>({
        queryKey: ['vehicle', id],
        queryFn: async () => {
            const response = await api.get(`/admin/vehicles/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}



export function useUpdateVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Vehicle> & { id: string }) => {
            // Remove nested objects and audit fields before sending
            const { customer, createdAt, ...updateData } = data as any;
            const response = await api.put(`/admin/vehicles/${id}`, updateData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Vehicle updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update vehicle');
        },
    });
}

export function useDeleteVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/vehicles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Vehicle deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete vehicle');
        },
    });
}
