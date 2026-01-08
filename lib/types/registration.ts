// Registration Status Enum
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Registration Request Form Data
export interface RegistrationRequestData {
    countryCode: string;
    phoneNumber: string;
    name: string;
    address?: string;
    gstNumber?: string;
    email?: string;
}

// Registration Request Response
export interface RegistrationRequestResponse {
    message: string;
    requestId: string;
    status: RegistrationStatus;
}

// Registration Status Response
export interface RegistrationStatusResponse {
    status: RegistrationStatus;
    message: string;
    rejectionReason?: string;
    reapplyDate?: string;
}

// Admin Registration Request (with metadata)
export interface AdminRegistrationRequest {
    id: string;
    countryCode: string;
    phoneNumber: string;
    name: string;
    address?: string;
    gstNumber?: string;
    email?: string;
    status: RegistrationStatus;
    requestedAt: string;
    reviewedAt?: string;
    reviewerId?: string;
    rejectionReason?: string;
}

// Admin Registration Requests List Response
export interface AdminRegistrationRequestsResponse {
    data: AdminRegistrationRequest[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// For backward compatibility, also export a transformed version
export interface TransformedRegistrationRequestsResponse {
    requests: AdminRegistrationRequest[];
    total: number;
    page: number;
    limit: number;
}

// Approve Request Response
export interface ApproveRequestResponse {
    message: string;
    garage: {
        id: string;
        name: string;
        phoneNumber: string;
    };
}

// Reject Request Data
export interface RejectRequestData {
    reason: string;
}

// Generic API Response
export interface ApiResponse {
    message: string;
}

// Error Response
export interface ApiErrorResponse {
    error: string;
    details?: string;
}
