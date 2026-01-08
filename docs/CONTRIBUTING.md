# Contributing Guide

Thank you for your interest in contributing to the Garage Management System! This document provides guidelines and best practices for development.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Component Patterns](#component-patterns)
5. [State Management](#state-management)
6. [Testing](#testing)
7. [Git Workflow](#git-workflow)
8. [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm, yarn, or pnpm
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **TypeScript Vue Plugin (Volar)** - Better TypeScript support

### Initial Setup

1. Fork the repository
2. Clone your fork:
   \`\`\`bash
   git clone https://github.com/your-username/garage-app-web.git
   cd garage-app-web
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Create \`.env.local\` from template:
   \`\`\`bash
   cp env.local.template .env.local
   \`\`\`

5. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- \`feature/\` - New features (e.g., \`feature/add-vehicle-search\`)
- \`fix/\` - Bug fixes (e.g., \`fix/login-redirect-loop\`)
- \`refactor/\` - Code refactoring (e.g., \`refactor/extract-validation-schemas\`)
- \`docs/\` - Documentation updates (e.g., \`docs/update-readme\`)
- \`chore/\` - Maintenance tasks (e.g., \`chore/update-dependencies\`)

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Types:**

- \`feat\` - New feature
- \`fix\` - Bug fix
- \`docs\` - Documentation changes
- \`style\` - Code style changes (formatting, no logic change)
- \`refactor\` - Code refactoring
- \`test\` - Adding or updating tests
- \`chore\` - Maintenance tasks

**Examples:**

\`\`\`
feat(customers): add export to CSV functionality

- Implemented CSV export using lib/export.ts
- Added export button to customers page
- Includes all customer fields in export

Closes #123
\`\`\`

\`\`\`
fix(auth): resolve infinite redirect loop on token expiry

- Clear both localStorage and cookie on 401
- Update middleware to check cookie first
- Add proper error handling in axios interceptor

Fixes #456
\`\`\`

---

## Code Style Guidelines

### TypeScript

#### Type Definitions

Always define explicit types for function parameters and return values:

\`\`\`typescript
// ✅ Good
function formatDate(date: Date): string {
return format(date, 'yyyy-MM-dd');
}

// ❌ Bad
function formatDate(date) {
return format(date, 'yyyy-MM-dd');
}
\`\`\`

#### Interfaces vs Types

- Use \`interface\` for object shapes that might be extended
- Use \`type\` for unions, intersections, and utility types

\`\`\`typescript
// ✅ Good
interface Customer {
id: string;
name: string;
phoneNumber: string;
}

type CustomerStatus = 'active' | 'inactive' | 'pending';

// ✅ Also good
type CustomerWithStatus = Customer \u0026 { status: CustomerStatus };
\`\`\`

#### Avoid \`any\`

Use \`unknown\` or specific types instead of \`any\`:

\`\`\`typescript
// ✅ Good
function handleError(error: unknown) {
if (error instanceof Error) {
console.error(error.message);
}
}

// ❌ Bad
function handleError(error: any) {
console.error(error.message);
}
\`\`\`

### React Components

#### Component Structure

\`\`\`tsx
'use client'; // Only if needed (client component)

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
title: string;
onSubmit: (data: FormData) =\u003e void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) =\u003e {
e.preventDefault();
setIsLoading(true);
// ... logic
setIsLoading(false);
};

return (
\u003cdiv\u003e
\u003ch1\u003e{title}\u003c/h1\u003e
\u003cform onSubmit={handleSubmit}\u003e
\u003cButton type=\"submit\" disabled={isLoading}\u003e
{isLoading ? 'Loading...' : 'Submit'}
\u003c/Button\u003e
\u003c/form\u003e
\u003c/div\u003e
);
}
\`\`\`

#### Naming Conventions

- **Components**: PascalCase (e.g., \`CustomerList\`, \`VehicleCard\`)
- **Hooks**: camelCase with \`use\` prefix (e.g., \`useCustomers\`, \`useAuth\`)
- **Utilities**: camelCase (e.g., \`formatDate\`, \`exportToCsv\`)
- **Constants**: UPPER_SNAKE_CASE (e.g., \`API_BASE_URL\`, \`MAX_RETRIES\`)

#### Props Destructuring

Always destructure props in the function signature:

\`\`\`tsx
// ✅ Good
export function CustomerCard({ name, phone, address }: CustomerCardProps) {
return \u003c...\u003e;
}

// ❌ Bad
export function CustomerCard(props: CustomerCardProps) {
return \u003cdiv\u003e{props.name}\u003c/div\u003e;
}
\`\`\`

### Tailwind CSS

#### Class Organization

Use the following order for Tailwind classes:

1. Layout (display, position, flex, grid)
2. Sizing (width, height, padding, margin)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Effects (opacity, transform, transition)
6. Responsive modifiers
7. State modifiers (hover, focus, active)

\`\`\`tsx
// ✅ Good
\u003cdiv className=\"flex items-center justify-between w-full p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow\"\u003e

// ❌ Bad (random order)
\u003cdiv className=\"hover:shadow-md bg-white transition-shadow flex p-4 border items-center w-full rounded-lg shadow-sm justify-between\"\u003e
\`\`\`

#### Use \`cn\` Utility for Conditional Classes

\`\`\`tsx
import { cn } from '@/lib/utils';

\u003cdiv className={cn(
'base-classes',
isActive \u0026\u0026 'active-classes',
isDisabled \u0026\u0026 'disabled-classes'
)}\u003e
\`\`\`

---

## Component Patterns

### Custom Hooks

Extract reusable logic into custom hooks:

\`\`\`typescript
// hooks/use-pagination.ts
export function usePagination(totalItems: number, itemsPerPage: number) {
const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) \* itemsPerPage;
const endIndex = startIndex + itemsPerPage;

return {
currentPage,
totalPages,
startIndex,
endIndex,
setCurrentPage,
};
}
\`\`\`

### Form Handling

Use React Hook Form with Zod validation:

\`\`\`tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
name: z.string().min(2, 'Name must be at least 2 characters'),
email: z.string().email('Invalid email address'),
});

type FormData = z.infer\u003ctypeof schema\u003e;

export function MyForm() {
const { register, handleSubmit, formState: { errors } } = useForm\u003cFormData\u003e({
resolver: zodResolver(schema),
});

const onSubmit = (data: FormData) =\u003e {
// Handle form submission
};

return (
\u003cform onSubmit={handleSubmit(onSubmit)}\u003e
\u003cinput {...register('name')} /\u003e
{errors.name \u0026\u0026 \u003cspan\u003e{errors.name.message}\u003c/span\u003e}
\u003c/form\u003e
);
}
\`\`\`

---

## State Management

### TanStack Query Patterns

#### Query Hook

\`\`\`typescript
export function useCustomers() {
return useQuery\u003cCustomersResponse\u003e({
queryKey: ['customers'],
queryFn: async () =\u003e {
const response = await api.get('/admin/customers');
return response.data;
},
staleTime: 5 _ 60 _ 1000, // 5 minutes
});
}
\`\`\`

#### Mutation Hook

\`\`\`typescript
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
onError: (error: AxiosError\u003c{ error: string }\u003e) =\u003e {
toast.error(error.response?.data?.error || 'Failed to create customer');
},
});
}
\`\`\`

---

## Testing

### Unit Tests

\u003e **Note**: Testing infrastructure is not yet set up. This section will be updated once testing is implemented.

Recommended testing stack:

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **MSW** - API mocking

---

## Git Workflow

### 1. Create a Feature Branch

\`\`\`bash
git checkout -b feature/add-vehicle-search
\`\`\`

### 2. Make Changes

- Write code following the style guidelines
- Test your changes locally
- Commit frequently with meaningful messages

### 3. Keep Your Branch Updated

\`\`\`bash
git fetch origin
git rebase origin/main
\`\`\`

### 4. Push Your Branch

\`\`\`bash
git push origin feature/add-vehicle-search
\`\`\`

---

## Pull Request Process

### Before Submitting

1. **Run linter**: \`npm run lint\`
2. **Build the project**: \`npm run build\`
3. **Test locally**: Verify all features work
4. **Update documentation**: If you added new features
5. **Rebase on main**: Ensure your branch is up to date

### PR Template

\`\`\`markdown

## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- List of changes
- Another change

## Testing

- [ ] Tested locally
- [ ] All existing features still work
- [ ] No console errors

## Screenshots (if applicable)

Add screenshots here

## Related Issues

Closes #123
\`\`\`

### Review Process

1. Submit your PR
2. Address reviewer feedback
3. Make requested changes
4. Push updates to the same branch
5. Wait for approval
6. Merge when approved

---

## Code Review Guidelines

### As a Reviewer

- Be constructive and respectful
- Explain the \"why\" behind suggestions
- Approve if changes are good, even if not perfect
- Test the changes locally if possible

### As an Author

- Don't take feedback personally
- Ask questions if you don't understand
- Respond to all comments
- Thank reviewers for their time

---

## Questions?

If you have questions about contributing:

1. Check this guide
2. Review existing code for examples
3. Ask in the team chat
4. Open a discussion on GitHub

---

**Thank you for contributing! 🎉**
