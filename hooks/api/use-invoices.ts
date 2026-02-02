import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export function useSendInvoice() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const response = await api.post(`/invoices/${serviceId}/send`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Invoice sent successfully via WhatsApp');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to send invoice');
        },
    });
}
