'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServices } from '@/hooks/api/use-services';
import { useVehicle } from '@/hooks/api/use-vehicles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  ChevronRight, 
  Clock, 
  History,
  MessageSquare,
  Wrench,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function VehicleHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const { data: vehicle } = useVehicle(vehicleId);
  
  const { data: services, isLoading } = useServices(vehicleId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 animate-pulse">Loading service history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit text-slate-500 hover:text-slate-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {vehicle?.model || 'Vehicle History'}
              </h1>
              <div className="flex items-center space-x-2 text-slate-500">
                <span className="font-mono text-sm tracking-wider">{vehicle?.numberPlate}</span>
                <span>•</span>
                <span className="text-sm">Owner: {vehicle?.customer?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {services?.length || 0} Total Services
          </Badge>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

        {/* Services List */}
        <div className="space-y-12 relative">
          {services && services.length > 0 ? (
            services.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()).map((service, index) => (
              <div key={service.id} className="relative pl-24 group">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-[29px] top-0 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                  index === 0 ? "bg-blue-600" : "bg-slate-400"
                )}>
                  {index === 0 ? (
                    <Clock className="h-3 w-3 text-white" />
                  ) : (
                    <History className="h-3 w-3 text-white" />
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          Scheduled Maintenance
                        </h3>
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {format(new Date(service.serviceDate), 'PPP')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="mb-1">
                        Interval: {service.intervalMonths} Months
                      </Badge>
                      <div className="text-xs text-slate-400">
                        Next: {format(new Date(service.nextServiceDate), 'MMM yyyy')}
                      </div>
                    </div>
                  </div>

                  {service.notes && (
                    <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="mt-1 h-4 w-4 text-slate-400" />
                        <div className="flex-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Service Summary</span>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {service.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-end">
                    <Button variant="outline" size="sm" className="text-xs">
                      View full details <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-24">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
                <History className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No Service history found</h3>
                <p className="text-slate-500">This vehicle hasn't had any recorded services yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
