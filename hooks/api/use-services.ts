import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface ServiceItem {
    service: string;
    cost: number;
}

export interface Service {
    id: string;
    vehicleId: string;
    serviceDate: string;
    nextServiceDate: string;
    intervalMonths: 1 | 2 | 3 | 6;
    serviceItems: ServiceItem[];
    notes?: string;
    vehicle?: {
        id: string;
        model: string;
        numberPlate: string;
        customerId: string;
        customer?: {
            id: string;
            name: string;
            countryCode: string;
            phoneNumber: string;
            address?: string;
            garage?: {
                id: string;
                name: string;
                countryCode: string;
                phoneNumber: string;
            };
        };
    };
}

// Helper function to calculate total cost
export const calculateTotalCost = (serviceItems: ServiceItem[]): number => {
    return serviceItems.reduce((total, item) => total + item.cost, 0);
}

export function useServices(vehicleId?: string) {
    return useQuery<Service[]>({
        queryKey: ['services', vehicleId],
        queryFn: async () => {
            const params = vehicleId ? { vehicleId } : {};
            const response = await api.get('/admin/services', { params });
            // API returns { data: [...] }, so we need response.data.data
            return response.data.data || response.data;
        },
    });
}

export function useService(id: string) {
    return useQuery<Service>({
        queryKey: ['service', id],
        queryFn: async () => {
            const response = await api.get(`/admin/services/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<Service, 'id'>) => {
            const response = await api.post('/admin/services', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
            toast.success('Service recorded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to record service');
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Service> & { id: string }) => {
            const response = await api.put(`/admin/services/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
            toast.success('Service updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update service');
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/services/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
            toast.success('Service deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete service');
        },
    });
}
