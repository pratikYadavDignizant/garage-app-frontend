import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface GarageSettings {
    name: string;
    address: string;
    phone: string;
    gstNumber?: string;
}

export function useSettings() {
    return useQuery<GarageSettings>({
        queryKey: ['settings'],
        queryFn: async () => {
            // Get garage ID from stored user data
            const userStr = localStorage.getItem('admin_user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);
            const garageId = user.garageId || user.id;

            const response = await api.get(`/admin/settings/${garageId}`);
            return response.data;
        },
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: GarageSettings) => {
            // Get garage ID from stored user data
            const userStr = localStorage.getItem('admin_user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);
            const garageId = user.garageId || user.id;

            const response = await api.put(`/admin/settings/${garageId}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            toast.success('Settings updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update settings');
        },
    });
}
