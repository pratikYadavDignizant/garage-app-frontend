import { describe, it, expect } from "vitest";
import { validatePhoneForCountry } from "./phone";

describe("validatePhoneForCountry (frontend)", () => {
  it("accepts valid India 10-digit number", () => {
    expect(validatePhoneForCountry("+91", "9876543210")).toEqual({
      isValid: true,
    });
  });

  it("rejects India 11-digit number", () => {
    const result = validatePhoneForCountry("+91", "98765432101");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects India 9-digit number", () => {
    const result = validatePhoneForCountry("+91", "987654321");
    expect(result.isValid).toBe(false);
  });

  it("accepts valid UAE 9-digit number", () => {
    expect(validatePhoneForCountry("+971", "501234567")).toEqual({
      isValid: true,
    });
  });

  it("rejects empty phone number", () => {
    const result = validatePhoneForCountry("+91", "");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("digits");
  });
});
