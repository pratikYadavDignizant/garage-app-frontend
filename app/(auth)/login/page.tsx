"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Phone, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { sendOtp, verifyOtp, isLoading, isOtpSent } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(
    process.env.NEXT_PUBLIC_ADMIN_PHONE || "",
  );
  const [otpCode, setOtpCode] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    await sendOtp(phoneNumber, "recaptcha-container");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    await verifyOtp(otpCode);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <LogIn className="h-6 w-6 text-slate-900 dark:text-slate-100" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in via OTP to manage your garage resources
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    className="pl-10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Keep captcha container in DOM but hide it when not needed */}
              <div
                id="recaptcha-container"
                className={isOtpSent ? "hidden" : ""}
              ></div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Verification Code
                </label>
                <div className="relative mt-1">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="pl-10"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              {/* Keep captcha container in DOM but hidden */}
              <div id="recaptcha-container" className="hidden"></div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Resend OTP
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
