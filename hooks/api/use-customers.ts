import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Customer {
    id: string;
    name: string;
    phone?: string;
    countryCode?: string;
    phoneNumber?: string;
    address?: string;
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

export function useCustomers(page = 1, limit = 20) {
    return useQuery<PaginatedResponse<Customer>>({
        queryKey: ['customers', page, limit],
        queryFn: async () => {
            const response = await api.get('/admin/customers', {
                params: { page, limit }
            });
            return response.data;
        },
    });
}

export function useCustomer(id: string) {
    return useQuery<Customer>({
        queryKey: ['customer', id],
        queryFn: async () => {
            const response = await api.get(`/admin/customers/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useSearchCustomers(query: string) {
    return useQuery<Customer[]>({
        queryKey: ['customers', 'search', query],
        queryFn: async () => {
            if (!query) return [];
            const response = await api.get('/customers/search', {
                params: { query }
            });
            return response.data;
        },
        enabled: !!query,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<Customer, 'id'>) => {
            const response = await api.post('/admin/customers', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create customer');
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Customer> & { id: string }) => {
            const response = await api.put(`/admin/customers/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update customer');
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/customers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete customer');
        },
    });
}
