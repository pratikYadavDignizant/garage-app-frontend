import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Reminder {
    id: string;
    vehicleId: string;
    serviceDate: string;
    nextServiceDate: string;
    intervalMonths: number;
    notes?: string;
    status: string;
    reminderSent: boolean;
    reminderSentAt?: string;
    createdAt: string;
    updatedAt: string;
    vehicle?: {
        id: string;
        customerId: string;
        model: string;
        numberPlate: string;
        defaultOilIntervalMonths: number;
        createdAt: string;
        updatedAt: string;
        customer?: {
            id: string;
            garageId: string;
            name: string;
            countryCode: string;
            phoneNumber: string;
            address?: string;
            createdAt: string;
            updatedAt: string;
        };
    };
    // Legacy flat fields for backward compatibility
    serviceId?: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    vehicleModel?: string;
    vehicleNumberPlate?: string;
    type?: 'today' | 'upcoming' | 'overdue';
}

export function useReminders(type: 'today' | 'upcoming' | 'overdue') {
    return useQuery<Reminder[]>({
        queryKey: ['reminders', type],
        queryFn: async () => {
            const response = await api.get('/admin/reminders', {
                params: { type }
            });
            return response.data;
        },
    });
}

export function useSendReminder() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const response = await api.post(`/admin/reminders/send/${serviceId}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Reminder sent successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to send reminder');
        },
    });
}
