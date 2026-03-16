import { z } from 'zod';

/**
 * Indian GST Number format: 15 characters
 * Format: 22AAAAA0000A1Z5
 *   - 2 digits: State code (01-37)
 *   - 5 uppercase letters: PAN holder name
 *   - 4 digits: PAN registration number
 *   - 1 uppercase letter: PAN entity type
 *   - 1 alphanumeric: Registration count (1-9, A-Z)
 *   - 1 literal 'Z': Default
 *   - 1 alphanumeric: Checksum
 */
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const GST_FORMAT_MESSAGE = 'Invalid GST number format (e.g. 29ABCDE1234F1Z5)';

/** Zod schema for an optional GST number field. Allows empty string or valid 15-char GST. */
export const gstNumberSchema = z
    .string()
    .trim()
    .toUpperCase()
    .regex(GST_REGEX, GST_FORMAT_MESSAGE)
    .optional()
    .or(z.literal(''));
