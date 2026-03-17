import { z } from "zod";

/**
 * Vehicle number plate: alphanumeric with optional hyphens/spaces.
 * Covers Indian formats: MH12AB1234, MH-12-AB-1234, KA 01 MK 5678
 * Also covers temporary plates: TEMP-001, DL-1C-1234
 * Rejects: special chars, emojis, scripts
 */
export const NUMBER_PLATE_REGEX = /^[A-Z0-9]+(?:[\- ][A-Z0-9]+)*$/;
export const NUMBER_PLATE_MESSAGE =
  "Only letters, numbers, hyphens, and spaces allowed (e.g. MH-12-AB-1234)";

export const numberPlateSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(4, "Number plate must be at least 4 characters")
  .max(15, "Number plate must be less than 15 characters")
  .regex(NUMBER_PLATE_REGEX, NUMBER_PLATE_MESSAGE);

/**
 * Vehicle model: letters, numbers, spaces, hyphens, dots, slashes.
 * Covers: "Maruti Swift", "Honda City 2024", "Royal Enfield Classic 350", "TVS Apache RTR 160 4V"
 */
export const VEHICLE_MODEL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9 .\-/]*$/;
export const vehicleModelSchema = z
  .string()
  .trim()
  .min(2, "Model must be at least 2 characters")
  .max(100, "Model must be less than 100 characters")
  .regex(VEHICLE_MODEL_REGEX, "Must start with letter or number. Only letters, numbers, spaces, hyphens, dots allowed");
