import { z } from "zod";

/**
 * Garage name: letters and numbers only, spaces allowed between words.
 * No symbols, no leading or trailing spaces.
 * Min 2 characters.
 */
export const GARAGE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
export const GARAGE_NAME_MESSAGE =
  "Must start with a letter. Only letters, numbers, and spaces allowed";

export const garageNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .regex(GARAGE_NAME_REGEX, GARAGE_NAME_MESSAGE);
