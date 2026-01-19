"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  useSettings,
  useUpdateSettings,
  GarageSettings,
} from "@/hooks/api/use-settings";
import {
  ShieldCheck,
  Lock,
  Building,
  Phone as PhoneIcon,
  MapPin,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState<GarageSettings>({
    name: "",
    address: "",
    phone: "",
    gstNumber: "",
  });

  // Sync form data with fetched settings
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "Settings" }]} />

      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Garage Settings
          </h1>
          <p className="text-slate-500">
            Configure your garage information for reminders and invoices.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Building className="h-4 w-4 mr-2 text-slate-400" /> Garage Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Premium Auto Care"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-slate-400" /> Contact
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="10 digit phone number"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" /> Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Full workshop address"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-400" /> GST Number
                (Optional)
              </label>
              <Input
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value })
                }
                placeholder="e.g. 29ABCDE1234F1Z5"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Security & Platform
          </h2>
          <p className="text-slate-500 text-sm">
            Manage global settings for your garage dashboard.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-sm">Two-Factor Authentication</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Require a security code in addition to your phone login.
            </p>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-medium text-sm">API Access</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Manage external API keys for third-party integrations.
            </p>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
