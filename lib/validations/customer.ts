import { z } from "zod";

/**
 * Customer name: starts with a letter, allows letters, spaces, apostrophes, hyphens, dots.
 * Covers: "Rushabh Rane", "O'Brien", "V. Kumar", "Singh-Kumar"
 * Rejects: numbers at start, symbols, emojis, scripts
 */
export const CUSTOMER_NAME_REGEX = /^[a-zA-Z]+(?:(?:[ '\-]|\.[ ]?)[a-zA-Z]+)*$/;
export const CUSTOMER_NAME_MESSAGE =
  "Must start with a letter. Only letters, spaces, apostrophes, hyphens, and dots allowed";

export const customerNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(CUSTOMER_NAME_REGEX, CUSTOMER_NAME_MESSAGE);
