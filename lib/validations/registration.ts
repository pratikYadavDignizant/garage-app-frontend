import { z } from 'zod';
import { phoneFieldsSchema } from './phone';
import { gstNumberSchema } from './gst';

// Registration form validation
export const registrationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
    address: z.string().trim().optional(),
    gstNumber: gstNumberSchema,
    email: z
        .string()
        .trim()
        .email('Invalid email address')
        .optional()
        .or(z.literal('')),
}).and(phoneFieldsSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Rejection reason validation
export const rejectReasonSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason must be less than 500 characters'),
});

export type RejectReasonFormData = z.infer<typeof rejectReasonSchema>;

// Status check validation
export const statusCheckSchema = phoneFieldsSchema;

export type StatusCheckFormData = z.infer<typeof statusCheckSchema>;
