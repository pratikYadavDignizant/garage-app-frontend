import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface EntityDeletePreview {
    message: string;
    counts?: {
        customers?: number;
        vehicles?: number;
        services?: number;
        templates?: number;
    };
    totalRecords?: number;
    entityName?: string;
    entityDetails?: Record<string, any>;
}

/**
 * Universal delete preview function
 * Works for any entity type (garages, customers, vehicles, services)
 *
 * Backend always returns 400 with preview data (counts of related records).
 * Actual deletion only happens via useEntityDelete with ?confirm=true.
 */
export async function getEntityDeletePreview(
    entityType: string,
    id: string
): Promise<EntityDeletePreview> {
    try {
        const response = await api.delete(`/admin/${entityType}/${id}`);
        // Should not reach here — backend always returns 400 for preview
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 400 && error.response?.data) {
            return error.response.data;
        }
        throw error;
    }
}

/**
 * Universal delete hook
 * Works for any entity type with cascade deletion
 */
export function useEntityDelete(entityType: string, queryKey: string[]) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/admin/${entityType}/${id}?confirm=true`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey });
            const message = data?.message || `${entityType} and all related data permanently deleted`;
            toast.success(message);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || `Failed to delete ${entityType}`);
        },
    });
}
