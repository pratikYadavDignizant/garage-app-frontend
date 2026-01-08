'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
          <FileQuestion className="h-12 w-12 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
            404 - Page Not Found
          </h1>
          <p className="max-w-[600px] text-slate-500 dark:text-slate-400 md:text-xl/relaxed">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
