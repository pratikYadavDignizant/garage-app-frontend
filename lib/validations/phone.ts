import {
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js";
import { z } from "zod";

/**
 * Combines country code and phone number into full E.164 format
 */
function combinePhone(countryCode: string, phoneNumber: string): string {
  const code = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
  return `${code}${phoneNumber}`;
}

/**
 * Validates phone number for a specific country code.
 * Ensures correct length and format (e.g. India +91 requires 10 digits).
 * @returns Object with isValid and optional error message
 */
export function validatePhoneForCountry(
  countryCode: string,
  phoneNumber: string
): { isValid: boolean; error?: string } {
  if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
    return { isValid: false, error: "Phone number must contain only digits" };
  }
  const fullNumber = combinePhone(countryCode, phoneNumber);
  try {
    const lengthError = validatePhoneNumberLength(fullNumber);
    if (lengthError) {
      const msg =
        lengthError === "TOO_SHORT"
          ? "Phone number is too short for selected country"
          : lengthError === "TOO_LONG"
            ? "Phone number is too long for selected country"
            : "Invalid phone number length for selected country";
      return { isValid: false, error: msg };
    }
    if (!isValidPhoneNumber(fullNumber)) {
      return {
        isValid: false,
        error: "Invalid phone number for selected country",
      };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid phone number for selected country" };
  }
}

/**
 * Reusable Zod schema for countryCode + phoneNumber fields.
 * Uses libphonenumber-js for per-country validation.
 */
export const phoneFieldsSchema = z
  .object({
    countryCode: z.string().regex(/^\+\d{1,4}$/, "Invalid country code"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.phoneNumber) return;
    const result = validatePhoneForCountry(
      data.countryCode || "+91",
      data.phoneNumber
    );
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "Invalid phone number",
        path: ["phoneNumber"],
      });
    }
  });
