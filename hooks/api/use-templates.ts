import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Template {
    id: string;
    name: string;
    type: 'WhatsApp' | 'Email' | 'SMS';
    content: string;
    lastModified: string;
}

export function useTemplates() {
    return useQuery<Template[]>({
        queryKey: ['templates'],
        queryFn: async () => {
            const response = await api.get('/admin/templates');
            return response.data;
        },
    });
}

export function useTemplate(id: string) {
    return useQuery<Template>({
        queryKey: ['template', id],
        queryFn: async () => {
            const response = await api.get(`/admin/templates/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useUpdateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Template> & { id: string }) => {
            const response = await api.patch(`/admin/templates/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update template');
        },
    });
}

export function useCreateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<Template, 'id' | 'lastModified'>) => {
            const response = await api.post('/admin/templates', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create template');
        },
    });
}
