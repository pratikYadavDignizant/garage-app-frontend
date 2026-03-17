"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { GST_REGEX, GST_FORMAT_MESSAGE } from "@/lib/validations/gst";
import { GARAGE_NAME_REGEX, GARAGE_NAME_MESSAGE } from "@/lib/validations/garage";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState<GarageSettings>({
    name: "",
    address: "",
    phone: "",
    gstNumber: "",
  });
  const [gstError, setGstError] = useState("");
  const [nameError, setNameError] = useState("");

  const validateGst = useCallback((value: string): boolean => {
    if (!value) { setGstError(""); return true; }
    const upper = value.toUpperCase();
    if (!GST_REGEX.test(upper)) {
      setGstError(GST_FORMAT_MESSAGE);
      return false;
    }
    setGstError("");
    return true;
  }, []);

  const validateName = useCallback((value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    if (!GARAGE_NAME_REGEX.test(trimmed)) {
      setNameError(GARAGE_NAME_MESSAGE);
      return false;
    }
    setNameError("");
    return true;
  }, []);

  // Sync form data with fetched settings + validate existing values
  useEffect(() => {
    if (settings) {
      setFormData(settings);
      if (settings.gstNumber) validateGst(settings.gstNumber);
      if (settings.name) validateName(settings.name);
    }
  }, [settings, validateGst, validateName]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValid = validateName(formData.name);
    const gstValid = validateGst(formData.gstNumber || "");
    if (!nameValid || !gstValid) return;
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
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (nameError) validateName(e.target.value);
                }}
                onBlur={() => validateName(formData.name)}
                placeholder="e.g. Premium Auto Care"
                required
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && (
                <p className="text-sm text-red-600">{nameError}</p>
              )}
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
              <Textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Full workshop address"
                rows={3}
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
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  setFormData({ ...formData, gstNumber: value });
                  if (gstError) validateGst(value);
                }}
                onBlur={() => validateGst(formData.gstNumber || "")}
                placeholder="e.g. 29ABCDE1234F1Z5"
                maxLength={15}
                className={gstError ? "border-red-500" : ""}
              />
              {gstError && (
                <p className="text-sm text-red-600">{gstError}</p>
              )}
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
