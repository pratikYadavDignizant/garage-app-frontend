import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  validationType?:
    | "text"
    | "number"
    | "phone"
    | "alphanumeric"
    | "gst"
    | "email";
  onValidChange?: (value: string, isValid: boolean) => void;
}

const validationPatterns = {
  text: /^[a-zA-Z\s\-']*$/,
  number: /^\d*$/,
  phone: /^\d{0,15}$/,
  alphanumeric: /^[a-zA-Z0-9\s\-]*$/,
  gst: /^[A-Z0-9]*$/,
  email: /^[a-zA-Z0-9@._\-]*$/,
};

export const ValidatedInput = React.forwardRef<
  HTMLInputElement,
  ValidatedInputProps
>(
  (
    {
      className,
      label,
      error,
      success,
      validationType = "text",
      onValidChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = React.useState(
      props.value?.toString() || "",
    );
    const [isTouched, setIsTouched] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Apply validation pattern
      if (validationType && validationPatterns[validationType]) {
        if (!validationPatterns[validationType].test(newValue)) {
          // Prevent invalid input
          return;
        }
      }

      // Additional transformations
      let transformedValue = newValue;
      if (validationType === "gst") {
        transformedValue = newValue.toUpperCase();
      }
      if (validationType === "text") {
        // Trim multiple spaces
        transformedValue = newValue.replace(/\s{2,}/g, " ");
      }

      setLocalValue(transformedValue);

      // Create synthetic event with transformed value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: transformedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);

      // Notify parent of validation state
      const isValid = !error && transformedValue.length > 0;
      onValidChange?.(transformedValue, isValid);
    };

    const handleBlur = () => {
      setIsTouched(true);
    };

    const showError = error && isTouched;
    const showSuccess = success && isTouched && !error;

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 transition-all",
              showError && "border-red-500 focus-visible:ring-red-500 pr-10",
              showSuccess &&
                "border-green-500 focus-visible:ring-green-500 pr-10",
              !showError &&
                !showSuccess &&
                "border-slate-200 focus-visible:ring-blue-600 dark:border-slate-800",
              className,
            )}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          {showError && (
            <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
          )}
          {showSuccess && (
            <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
          )}
        </div>
        {showError && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

ValidatedInput.displayName = "ValidatedInput";
