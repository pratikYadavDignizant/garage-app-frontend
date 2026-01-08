"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error is already logged by React
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
            Something went wrong!
          </h1>
          <p className="max-w-[600px] text-slate-500 dark:text-slate-400">
            We encountered an unexpected error. Please try again or contact
            support if the issue persists.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => reset()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
