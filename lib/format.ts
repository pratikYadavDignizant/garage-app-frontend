/**
 * Format a date string or Date object to dd/mm/yy format
 * @param date - Date string or Date object
 * @returns Formatted date string in dd/mm/yy format or 'N/A' if invalid
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return 'N/A';
        }

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = String(dateObj.getFullYear());

        return `${day}/${month}/${year}`;
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Format a date string or Date object to dd/mm/yyyy format (full year)
 * @param date - Date string or Date object
 * @returns Formatted date string in dd/mm/yyyy format or 'N/A' if invalid
 */
export function formatDateFull(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return 'N/A';
        }

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = String(dateObj.getFullYear());

        return `${day}/${month}/${year}`;
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Format a phone number with country code
 * @param countryCode - Country code (e.g., "+91")
 * @param phoneNumber - Phone number
 * @returns Formatted phone number or 'N/A' if invalid
 */
export function formatPhoneNumber(countryCode?: string, phoneNumber?: string): string {
    if (!phoneNumber) return 'N/A';
    if (!countryCode) return phoneNumber;
    return `${countryCode} ${phoneNumber}`;
}

