# System Architecture

This document provides a comprehensive overview of the Garage Management System's architecture, design patterns, and technical implementation.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Authentication Flow](#authentication-flow)
4. [Data Models](#data-models)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Component Architecture](#component-architecture)
8. [Routing \u0026 Middleware](#routing--middleware)

---

## Overview

The Garage Management System is a full-stack web application built with Next.js 16 (App Router), TypeScript, and Firebase Authentication. It follows a client-server architecture with a React frontend and a RESTful backend API.

### Architecture Diagram

\`\`\`mermaid
graph TB
User[User Browser]
NextJS[Next.js Frontend]
Firebase[Firebase Auth]
Backend[Backend API]
DB[(Database)]
WhatsApp[WhatsApp Business API]

    User --\u003e NextJS
    NextJS --\u003e Firebase
    NextJS --\u003e Backend
    Backend --\u003e DB
    Backend --\u003e WhatsApp

\`\`\`

---

## Project Structure

### Directory Organization

\`\`\`
garage-app-web/
├── app/ # Next.js App Router
│ ├── (auth)/ # Auth route group (no layout)
│ │ ├── login/ # User login (OTP)
│ │ └── admin/ # Admin login
│ │ └── login/
│ ├── admin/ # Protected admin routes
│ │ ├── dashboard/ # Main dashboard
│ │ ├── customers/ # Customer CRUD
│ │ ├── vehicles/ # Vehicle CRUD + History
│ │ ├── services/ # Service records
│ │ ├── reminders/ # Reminder management
│ │ ├── templates/ # Message templates
│ │ ├── settings/ # Settings page
│ │ └── layout.tsx # Admin layout (sidebar)
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ ├── error.tsx # Error boundary
│ └── not-found.tsx # 404 page
├── components/
│ ├── layout/ # Layout components
│ │ ├── sidebar.tsx # Collapsible sidebar
│ │ ├── header.tsx # Top navigation
│ │ └── breadcrumbs.tsx # Breadcrumb navigation
│ ├── providers/ # React Context providers
│ │ └── query-provider.tsx # TanStack Query provider
│ └── ui/ # Reusable UI components
│ ├── button.tsx
│ ├── input.tsx
│ ├── data-table.tsx # Generic table component
│ ├── stat-card.tsx # Dashboard KPI cards
│ └── ...
├── hooks/
│ ├── use-auth.ts # Authentication hook
│ └── api/ # API hooks (TanStack Query)
│ ├── use-customers.ts
│ ├── use-vehicles.ts
│ ├── use-services.ts
│ ├── use-reminders.ts
│ └── ...
├── lib/
│ ├── axios.ts # Axios instance + interceptors
│ ├── firebase.ts # Firebase initialization
│ ├── format.ts # Date/number formatting
│ ├── export.ts # CSV export utilities
│ └── utils.ts # General utilities
└── middleware.ts # Route protection middleware
\`\`\`

### Key Design Decisions

1. **App Router**: Using Next.js 16 App Router for improved performance and developer experience
2. **Route Groups**: \`(auth)\` group excludes authentication pages from the admin layout
3. **Colocation**: Components, hooks, and utilities are organized by feature/domain
4. **Type Safety**: Strict TypeScript configuration for compile-time error detection

---

## Authentication Flow

### Firebase Phone OTP Authentication

The application uses Firebase Authentication with phone number and OTP verification.

\`\`\`mermaid
sequenceDiagram
participant User
participant Frontend
participant Firebase
participant Backend
participant Database

    User-\u003e\u003eFrontend: Enter Phone Number
    Frontend-\u003e\u003eFirebase: Request OTP (reCAPTCHA)
    Firebase--\u003e\u003eUser: SMS with OTP Code
    User-\u003e\u003eFrontend: Enter OTP Code
    Frontend-\u003e\u003eFirebase: Verify OTP
    Firebase--\u003e\u003eFrontend: Firebase ID Token
    Frontend-\u003e\u003eBackend: POST /auth/firebase (Bearer Token)
    Backend-\u003e\u003eDatabase: Verify/Create User
    Backend--\u003e\u003eFrontend: Session JWT + User Data
    Frontend-\u003e\u003eFrontend: Store Token (localStorage + Cookie)
    Frontend-\u003e\u003eUser: Redirect to Dashboard

\`\`\`

### Implementation Details

#### 1. Firebase Initialization ([lib/firebase.ts](file:///d:/nextJS/garage-app-web/lib/firebase.ts))

\`\`\`typescript
import { initializeApp } from \"firebase/app\";
import { getAuth } from \"firebase/auth\";

const firebaseConfig = {
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
\`\`\`

#### 2. Authentication Hook ([hooks/use-auth.ts](file:///d:/nextJS/garage-app-web/hooks/use-auth.ts))

Provides three main functions:

- \`sendOtp(phoneNumber)\` - Initiates OTP flow
- \`verifyOtp(code)\` - Verifies OTP and exchanges for backend token
- \`logout()\` - Clears session and redirects

#### 3. Middleware Protection ([middleware.ts](file:///d:/nextJS/garage-app-web/middleware.ts))

\`\`\`typescript
export function middleware(request: NextRequest) {
const token = request.cookies.get('admin_token')?.value;
const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

if (isAdminRoute \u0026\u0026 !token) {
return NextResponse.redirect(new URL('/login', request.url));
}

return NextResponse.next();
}
\`\`\`

---

## Data Models

### Entity Relationship Diagram

\`\`\`mermaid
erDiagram
GARAGE ||--o{ CUSTOMER : manages
CUSTOMER ||--o{ VEHICLE : owns
VEHICLE ||--o{ SERVICE : has
SERVICE ||--o{ REMINDER : triggers
GARAGE ||--o{ TEMPLATE : creates

    GARAGE {
        string id PK
        string name
        string phone
        string address
        string gstNumber
        boolean isVerified
        string firebaseUid
        datetime createdAt
    }

    CUSTOMER {
        string id PK
        string garageId FK
        string name
        string phoneNumber
        string address
        datetime createdAt
    }

    VEHICLE {
        string id PK
        string customerId FK
        string model
        string plateNumber
        int defaultIntervalMonths
        datetime createdAt
    }

    SERVICE {
        string id PK
        string vehicleId FK
        date serviceDate
        int intervalMonths
        date nextServiceDate
        string notes
        datetime createdAt
    }

    REMINDER {
        string id PK
        string serviceId FK
        string status
        datetime sentAt
    }

    TEMPLATE {
        string id PK
        string garageId FK
        string name
        string content
        datetime createdAt
    }

\`\`\`

### Key Relationships

1. **Garage → Customer**: One-to-Many (a garage manages multiple customers)
2. **Customer → Vehicle**: One-to-Many (a customer can own multiple vehicles)
3. **Vehicle → Service**: One-to-Many (a vehicle has multiple service records)
4. **Service → Reminder**: One-to-Many (a service can trigger multiple reminders)

---

## API Integration

### Axios Configuration

All API requests go through a centralized Axios instance ([lib/axios.ts](file:///d:/nextJS/garage-app-web/lib/axios.ts)):

\`\`\`typescript
const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Add auth token
api.interceptors.request.use((config) =\u003e {
const token = localStorage.getItem('admin_token');
if (token) {
config.headers.Authorization = \`Bearer \${token}\`;
}
return config;
});

// Response Interceptor: Handle 401 errors
api.interceptors.response.use(
(response) =\u003e response,
(error) =\u003e {
if (error.response?.status === 401) {
// Clear session and redirect to login
localStorage.removeItem('admin_token');
window.location.href = '/admin/login';
}
return Promise.reject(error);
}
);
\`\`\`

### API Endpoints

| Resource  | Endpoint             | Methods                |
| --------- | -------------------- | ---------------------- |
| Garages   | \`/admin/garages\`   | GET, POST, PUT, DELETE |
| Customers | \`/admin/customers\` | GET, POST, PUT, DELETE |
| Vehicles  | \`/admin/vehicles\`  | GET, POST, PUT, DELETE |
| Services  | \`/admin/services\`  | GET, POST, PUT, DELETE |
| Reminders | \`/admin/reminders\` | GET, POST              |
| Templates | \`/admin/templates\` | GET, POST, PUT, DELETE |
| Settings  | \`/admin/settings\`  | GET, PUT               |
| Summary   | \`/admin/summary\`   | GET                    |

---

## State Management

### TanStack Query (React Query)

We use TanStack Query v5 for server state management, providing:

- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

#### Query Hook Pattern

Example: [hooks/api/use-customers.ts](file:///d:/nextJS/garage-app-web/hooks/api/use-customers.ts)

\`\`\`typescript
export function useCustomers() {
return useQuery\u003cCustomersResponse\u003e({
queryKey: ['customers'],
queryFn: async () =\u003e {
const response = await api.get('/admin/customers');
return response.data;
},
});
}

export function useCreateCustomer() {
const queryClient = useQueryClient();

return useMutation({
mutationFn: async (data: CreateCustomerData) =\u003e {
const response = await api.post('/admin/customers', data);
return response.data;
},
onSuccess: () =\u003e {
queryClient.invalidateQueries({ queryKey: ['customers'] });
toast.success('Customer created successfully');
},
});
}
\`\`\`

### Query Keys Convention

- \`['customers']\` - All customers
- \`['customer', id]\` - Single customer
- \`['vehicles']\` - All vehicles
- \`['vehicle', id]\` - Single vehicle
- \`['services']\` - All services
- \`['reminders', status]\` - Reminders by status

---

## Component Architecture

### Component Hierarchy

\`\`\`
App
├── QueryProvider (TanStack Query)
├── Layout
│ ├── Sidebar
│ ├── Header
│ └── Page Content
│ ├── Breadcrumbs
│ ├── PageHeader
│ └── Feature Components
│ ├── DataTable
│ ├── Forms (Dialog)
│ └── Actions
\`\`\`

### Design Patterns

#### 1. Compound Components

DataTable uses compound component pattern for flexibility:

\`\`\`tsx
\u003cDataTable data={customers} columns={columns}\u003e
\u003cDataTable.Header /\u003e
\u003cDataTable.Body /\u003e
\u003cDataTable.Pagination /\u003e
\u003c/DataTable\u003e
\`\`\`

#### 2. Render Props

Used for flexible rendering in tables:

\`\`\`tsx
const columns = [
{
accessorKey: 'name',
header: 'Name',
cell: ({ row }) =\u003e \u003cspan\u003e{row.original.name}\u003c/span\u003e,
},
];
\`\`\`

#### 3. Custom Hooks

Encapsulate complex logic:

\`\`\`tsx
const { sendOtp, verifyOtp, isLoading } = useAuth();
const { data: customers, isLoading } = useCustomers();
const createCustomer = useCreateCustomer();
\`\`\`

---

## Routing \u0026 Middleware

### Route Protection

The [middleware.ts](file:///d:/nextJS/garage-app-web/middleware.ts) file protects admin routes:

\`\`\`typescript
export const config = {
matcher: ['/admin/:path*'],
};

export function middleware(request: NextRequest) {
const token = request.cookies.get('admin_token')?.value;

if (!token) {
return NextResponse.redirect(new URL('/login', request.url));
}

return NextResponse.next();
}
\`\`\`

### Dynamic Routes

- \`/admin/vehicles/[id]/history\` - Vehicle service history
- \`/admin/customers/[id]\` - Customer details (future)

### Route Groups

- \`(auth)\` - Authentication pages without admin layout
- \`admin\` - Protected admin pages with sidebar layout

---

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component for optimized images
3. **Query Caching**: TanStack Query reduces redundant API calls
4. **Lazy Loading**: Components loaded on-demand
5. **Memoization**: React.memo for expensive components

---

## Security Considerations

1. **Authentication**: Firebase OTP + Backend JWT validation
2. **Route Protection**: Middleware checks for valid tokens
3. **XSS Prevention**: React escapes content by default
4. **CSRF Protection**: SameSite cookies
5. **Environment Variables**: Sensitive data in \`.env.local\` (not committed)

---

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Offline Support**: PWA with service workers
3. **Multi-tenancy**: Support for multiple garages per account
4. **Role-Based Access Control**: Different permission levels
5. **Audit Logging**: Track all user actions

---

For more information, see:

- [README.md](../README.md) - Setup and installation
- [USER_GUIDE.md](./USER_GUIDE.md) - How to use the application
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
