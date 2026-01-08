import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateNextServiceDate(date: string | Date, intervalMonths: number): Date {
    // Dynamic import would be ideal but for utility file static is fine, 
    // assuming date-fns is tree-shakeable or used elsewhere.
    // However, to avoid import errors if not already imported, let's just use native logic 
    // or assume we can add the import at the top.
    // Let's rewrite the file content to be safe.
    const d = new Date(date);
    d.setMonth(d.getMonth() + intervalMonths);
    return d;
}
