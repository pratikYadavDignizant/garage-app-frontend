'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
  { code: '+1', label: '🇺🇸 +1', country: 'USA/Canada' },
  { code: '+44', label: '🇬🇧 +44', country: 'UK' },
  { code: '+971', label: '🇦🇪 +971', country: 'UAE' },
  { code: '+65', label: '🇸🇬 +65', country: 'Singapore' },
  { code: '+61', label: '🇦🇺 +61', country: 'Australia' },
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
          onChange={(e) => onCountryCodeChange(e.target.value)}
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
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="9876543210"
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
