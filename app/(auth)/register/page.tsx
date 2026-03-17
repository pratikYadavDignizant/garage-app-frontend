"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useSubmitRegistration,
  useCheckRegistrationStatus,
} from "@/hooks/api/use-registration";
import {
  registrationSchema,
  statusCheckSchema,
  type RegistrationFormData,
  type StatusCheckFormData,
} from "@/lib/validations/registration";
import {
  Store,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showStatusChecker, setShowStatusChecker] = useState(false);
  const [statusPhone, setStatusPhone] = useState("");
  const [statusCountryCode, setStatusCountryCode] = useState("+91");
  const [checkEnabled, setCheckEnabled] = useState(false);

  const submitRegistration = useSubmitRegistration();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
      name: "",
      address: "",
      gstNumber: "",
      email: "",
    },
  });

  const { data: statusData, isLoading: isCheckingStatus } =
    useCheckRegistrationStatus(statusPhone, statusCountryCode, checkEnabled);

  const onSubmit = handleSubmit(async (data: RegistrationFormData) => {
    await submitRegistration.mutateAsync(data);
    reset();
    setShowStatusChecker(true);
    setStatusPhone(data.phoneNumber);
    setStatusCountryCode(data.countryCode);
  });

  const handleCheckStatus = () => {
    if (statusPhone.length === 10) {
      setCheckEnabled(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Register Your Garage
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Submit your registration request and get admin approval to start
            managing your garage
          </p>
        </div>

        {/* Registration Form */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Phone Number */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="countryCode">Code</Label>
                <Input
                  id="countryCode"
                  type="text"
                  placeholder="+91"
                  {...register("countryCode")}
                  disabled={submitRegistration.isPending}
                  className="text-center"
                />
                {errors.countryCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.countryCode.message}
                  </p>
                )}
              </div>
              <div className="col-span-3">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="9876543210"
                    className="pl-10"
                    {...register("phoneNumber")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setValue("phoneNumber", value);
                    }}
                    disabled={submitRegistration.isPending}
                    maxLength={10}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Garage Name */}
            <div>
              <Label htmlFor="name">
                Garage Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="My Garage"
                  className="pl-10"
                  {...register("name")}
                  disabled={submitRegistration.isPending}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                placeholder="123 Street, City, State"
                rows={3}
                {...register("address")}
                disabled={submitRegistration.isPending}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* GST Number */}
            <div>
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="gstNumber"
                  type="text"
                  placeholder="29ABC1234F1Z5"
                  className="pl-10"
                  {...register("gstNumber")}
                  disabled={submitRegistration.isPending}
                  maxLength={15}
                />
              </div>
              {errors.gstNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.gstNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="garage@example.com"
                  className="pl-10"
                  {...register("email")}
                  disabled={submitRegistration.isPending}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitRegistration.isPending}
            >
              {submitRegistration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Registration Request
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Status Checker */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Check Registration Status
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Enter your phone number to check the status of your registration
            request
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Input
                  type="text"
                  placeholder="+91"
                  value={statusCountryCode}
                  onChange={(e) => setStatusCountryCode(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={statusPhone}
                  onChange={(e) => {
                    setStatusPhone(e.target.value.replace(/\D/g, ""));
                    setCheckEnabled(false);
                  }}
                  maxLength={10}
                />
              </div>
            </div>

            <Button
              onClick={handleCheckStatus}
              disabled={statusPhone.length !== 10 || isCheckingStatus}
              className="w-full"
              variant="outline"
            >
              {isCheckingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Status
                </>
              )}
            </Button>

            {/* Status Display */}
            {statusData && (
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status:
                  </span>
                  <StatusBadge status={statusData.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  {statusData.message}
                </p>
                {statusData.rejectionReason && (
                  <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-xs font-medium text-red-800 dark:text-red-400">
                      Rejection Reason:
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {statusData.rejectionReason}
                    </p>
                  </div>
                )}
                {statusData.reapplyDate && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    You can reapply after{" "}
                    {new Date(statusData.reapplyDate).toLocaleDateString()}
                  </p>
                )}
                {statusData.status === "APPROVED" && (
                  <Link href="/login">
                    <Button className="mt-4 w-full">Go to Login</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Already registered? Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
