import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface AdminSummary {
    garages: {
        total: number;
        active: number;
        inactive: number;
    };
    customers: number;
    vehicles: number;
    services: number;
    reminders: {
        today: number;
        upcoming: number;
        overdue: number;
    };
}

export function useAdminSummary() {
    return useQuery<AdminSummary>({
        queryKey: ['admin-summary'],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/summary');
            return response.data;
        },
    });
}
