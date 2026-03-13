"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  countryCodeError?: string;
  phoneNumberError?: string;
  disabled?: boolean;
}

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91", country: "India", placeholder: "9876543210", maxLength: 10 },
  { code: "+1", label: "🇺🇸 +1", country: "USA/Canada", placeholder: "2025551234", maxLength: 10 },
  { code: "+44", label: "🇬🇧 +44", country: "UK", placeholder: "7911123456", maxLength: 11 },
  { code: "+971", label: "🇦🇪 +971", country: "UAE", placeholder: "501234567", maxLength: 9 },
  { code: "+65", label: "🇸🇬 +65", country: "Singapore", placeholder: "91234567", maxLength: 8 },
  { code: "+61", label: "🇦🇺 +61", country: "Australia", placeholder: "412345678", maxLength: 9 },
];

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  countryCodeError,
  phoneNumberError,
  disabled = false,
}: PhoneInputProps) {
  return (
    <div className="space-y-2">
      <Label>Phone Number</Label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => {
            const newCode = e.target.value;
            onCountryCodeChange(newCode);
            const maxLen =
              COUNTRY_CODES.find((c) => c.code === newCode)?.maxLength ?? 15;
            if (phoneNumber.length > maxLen) {
              onPhoneNumberChange(phoneNumber.slice(0, maxLen));
            }
          }}
          disabled={disabled}
          className="flex h-10 w-[120px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
        <Input
          type="tel"
          placeholder={
            COUNTRY_CODES.find((c) => c.code === countryCode)?.placeholder ??
            "9876543210"
          }
          maxLength={
            COUNTRY_CODES.find((c) => c.code === countryCode)?.maxLength ?? 15
          }
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            const maxLen =
              COUNTRY_CODES.find((c) => c.code === countryCode)?.maxLength ?? 15;
            onPhoneNumberChange(value.slice(0, maxLen));
          }}
          disabled={disabled}
          className="flex-1"
        />
      </div>
      {(countryCodeError || phoneNumberError) && (
        <p className="text-xs text-red-500">
          {countryCodeError || phoneNumberError}
        </p>
      )}
    </div>
  );
}
