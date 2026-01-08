# Known Issues \u0026 Planned Improvements

This document consolidates findings from code audits and outlines known limitations, issues, and planned improvements for the Garage Management System.

## 📊 Priority Legend

- 🔴 **High Priority** - Critical issues affecting performance or functionality
- 🟡 **Medium Priority** - Important improvements for better UX or maintainability
- 🟢 **Low Priority** - Nice-to-have enhancements

---

## 🔴 High Priority Issues

### 1. Inefficient Vehicle Lookup in History Page

**Location**: \`app/admin/vehicles/[id]/history/page.tsx\`

**Issue**: The vehicle history page fetches **all vehicles** just to find one by ID:

\`\`\`typescript
const { data: vehicles } = useVehicles();
const vehicle = vehicles?.data.find((v) =\u003e String(v.id) === vehicleId);
\`\`\`

**Impact**: Performance degradation with scale - loads potentially hundreds of vehicles when only one is needed.

**Recommended Solution**: Create a \`useVehicle(id)\` hook that fetches a single vehicle:

\`\`\`typescript
export function useVehicle(id: string) {
return useQuery\u003cVehicle\u003e({
queryKey: ['vehicle', id],
queryFn: async () =\u003e {
const response = await api.get(\`/admin/vehicles/\${id}\`);
return response.data;
},
});
}
\`\`\`

**Status**: 🔄 Planned for next sprint

---

### 2. Mixed Type Validation in Services Page

**Location**: \`app/admin/services/page.tsx\`

**Issue**: The service form uses \`z.union([z.string(), z.number()])\` for \`vehicleId\`, which contradicts the string-only ID standardization.

**Impact**: Type safety breach, potential runtime errors.

**Recommended Solution**: Update to string-only validation:

\`\`\`typescript
vehicleId: z.string().min(1, 'Vehicle is required'),
\`\`\`

**Status**: 🔄 Planned

---

## 🟡 Medium Priority Issues

### 3. Inconsistent Error Property Names

**Location**: Multiple API hooks

**Issue**: Some hooks use \`error.response?.data?.error\` while others use \`error.response?.data?.message\`.

**Examples**:

- \`use-customers.ts\`: uses \`.error\`
- \`use-garages.ts\`: uses \`.message\`

**Impact**: Developer confusion, inconsistent error handling.

**Recommended Solution**: Standardize on \`.message\` (more conventional):

\`\`\`typescript
onError: (error: AxiosError\u003c{ message: string }\u003e) =\u003e {
toast.error(error.response?.data?.message || 'Operation failed');
},
\`\`\`

**Status**: 🔄 Planned

---

### 4. No Error States in UI

**Location**: Multiple pages (VehiclesPage, ServicesPage, etc.)

**Issue**: Pages don't show error states if API calls fail.

**Impact**: Poor UX on failures - users see loading spinner indefinitely.

**Recommended Solution**: Add error handling UI:

\`\`\`typescript
if (error) {
return \u003cErrorMessage message=\"Failed to load vehicles\" /\u003e;
}
\`\`\`

**Status**: 🔄 Planned

---

### 5. Scattered Validation Schemas

**Location**: All page files (\`admin/vehicles\`, \`admin/customers\`, etc.)

**Issue**: Zod schemas are defined inside page files. Can't reuse for bulk import or API routes.

**Impact**: Code duplication, maintenance overhead.

**Recommended Solution**: Centralize schemas in \`lib/validations.ts\`:

\`\`\`typescript
// lib/validations.ts
export const customerSchema = z.object({
name: z.string().trim().min(2, 'Name is required'),
phoneNumber: z.string().trim().min(10, 'Valid phone number required'),
address: z.string().trim().optional(),
});

export const vehicleSchema = z.object({
customerId: z.string().min(1, 'Customer is required'),
model: z.string().trim().min(2, 'Model is required'),
plateNumber: z.string().trim().min(3, 'Plate number is required'),
defaultIntervalMonths: z.number().int().positive(),
});
\`\`\`

**Status**: 🔄 Planned

---

### 6. No Input Sanitization

**Location**: All form inputs

**Issue**: User inputs are sent directly to the backend without client-side sanitization.

**Impact**: Accidental whitespace-only submissions possible.

**Recommended Solution**: Add \`.trim()\` to string fields:

\`\`\`typescript
name: z.string().trim().min(2, 'Name is required'),
\`\`\`

**Status**: 🔄 Planned

---

### 7. Ad-hoc Loading States

**Location**: Multiple pages

**Issue**: Loading states are manually implemented using \`Loader2\` and custom divs in every page.

**Impact**: Inconsistent loading visuals, code duplication.

**Recommended Solution**: Create a reusable \`\u003cLoadingState /\u003e\` component:

\`\`\`tsx
// components/ui/loading-state.tsx
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
return (
\u003cdiv className=\"flex items-center justify-center p-8\"\u003e
\u003cLoader2 className=\"h-8 w-8 animate-spin text-slate-400\" /\u003e
\u003cspan className=\"ml-2 text-slate-600\"\u003e{message}\u003c/span\u003e
\u003c/div\u003e
);
}
\`\`\`

**Status**: 🔄 Planned

---

## 🟢 Low Priority Issues

### 8. Hardcoded Service Title

**Location**: \`app/admin/vehicles/[id]/history/page.tsx\`

**Issue**: All services are labeled \"Scheduled Maintenance\" regardless of actual service type.

**Impact**: Limited flexibility, less informative history.

**Recommended Solution**: Either:

1. Add a \`serviceType\` field to the Service model
2. Use the \`notes\` field to derive a title
3. Make it dynamic based on interval (e.g., \"Oil Change Service\")

**Status**: 💡 Future enhancement

---

### 9. Non-functional \"View Details\" Button

**Location**: \`app/admin/vehicles/[id]/history/page.tsx\`

**Issue**: Button labeled \"View full details\" has no \`onClick\` handler.

**Impact**: Misleading UI.

**Recommended Solution**: Either remove it or implement a detail modal/page.

**Status**: 💡 Future enhancement

---

### 10. Export Function Doesn't Handle Nested Objects Well

**Location**: \`lib/export.ts\`

**Issue**: CSV export uses \`JSON.stringify()\` for nested objects, creating unreadable CSV cells.

**Impact**: Poor export quality for complex data.

**Recommended Solution**: Flatten nested objects before export:

\`\`\`typescript
// For: { id: 1, name: \"John\", address: { city: \"NYC\" } }
// Output: { id: 1, name: \"John\", address_city: \"NYC\" }

function flattenObject(obj: Record\u003cstring, any\u003e, prefix = ''): Record\u003cstring, any\u003e {
return Object.keys(obj).reduce((acc, key) =\u003e {
const value = obj[key];
const newKey = prefix ? \`\${prefix}\_\${key}\` : key;

    if (typeof value === 'object' \u0026\u0026 value !== null \u0026\u0026 !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;

}, {} as Record\u003cstring, any\u003e);
}
\`\`\`

**Status**: 💡 Future enhancement

---

### 11. No Clear Selection Indicator in Services Page

**Location**: \`app/admin/services/page.tsx\`

**Issue**: Unlike the Vehicles page, the Services page doesn't have a \"Clear\" button or disabled state when a vehicle is selected.

**Impact**: Minor UX inconsistency.

**Recommended Solution**: Apply the same UX pattern used in VehiclesPage.

**Status**: 💡 Future enhancement

---

## 🚀 Planned Features

### 1. Optimistic Updates

**Description**: Update UI immediately before server response for better perceived performance.

**Impact**: Significantly improved UX.

**Implementation**: Use TanStack Query's optimistic updates feature:

\`\`\`typescript
const mutation = useMutation({
mutationFn: updateCustomer,
onMutate: async (newCustomer) =\u003e {
await queryClient.cancelQueries({ queryKey: ['customers'] });
const previousCustomers = queryClient.getQueryData(['customers']);

    queryClient.setQueryData(['customers'], (old) =\u003e {
      // Update optimistically
    });

    return { previousCustomers };

},
onError: (err, newCustomer, context) =\u003e {
queryClient.setQueryData(['customers'], context.previousCustomers);
},
});
\`\`\`

**Status**: 📅 Q2 2026

---

### 2. Real-time Updates

**Description**: WebSocket integration for live data updates across multiple users.

**Impact**: Better collaboration for multi-user garages.

**Status**: 📅 Q3 2026

---

### 3. Offline Support

**Description**: PWA with service workers for offline functionality.

**Impact**: Works without internet connection.

**Status**: 📅 Q4 2026

---

### 4. Role-Based Access Control (RBAC)

**Description**: Different permission levels (Admin, Manager, Mechanic, Receptionist).

**Impact**: Better security and workflow management.

**Status**: 📅 Q1 2027

---

## 🐛 Bug Tracker

### Active Bugs

\u003e No critical bugs currently reported.

### Recently Fixed

1. ✅ **Infinite redirect loop on token expiry** - Fixed in v0.1.1
2. ✅ **Vehicle filter not working** - Fixed in v0.1.2
3. ✅ **Firebase UID not being set** - Fixed in v0.1.3

---

## 📝 Technical Debt

### 1. Missing Unit Tests

**Description**: No test coverage currently exists.

**Plan**: Set up Jest + React Testing Library in Q1 2026.

---

### 2. No Error Monitoring

**Description**: No Sentry or similar error tracking.

**Plan**: Integrate Sentry in Q1 2026.

---

### 3. No Performance Monitoring

**Description**: No analytics on Core Web Vitals.

**Plan**: Add Vercel Analytics or similar in Q2 2026.

---

## 🔄 Update History

- **2026-01-08**: Initial consolidation of audit reports
- **2025-12-24**: ID migration to string type completed
- **2025-12-22**: RBAC system implemented

---

## 📬 Reporting New Issues

If you discover a new issue:

1. Check if it's already listed here
2. Verify it's reproducible
3. Create a GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/environment details

---

**This document is updated regularly as issues are discovered and resolved.**
