"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceItem {
  sno: number;
  description: string;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  service: {
    id: string;
    serviceDate: string;
    nextServiceDate: string;
    intervalMonths: number;
    notes?: string;
    status: string;
  };
  vehicle: {
    id: string;
    model: string;
    numberPlate: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    address?: string;
  };
  garage: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    gstNumber?: string;
    email?: string;
    logo?: string | null;
  };
  items: InvoiceItem[];
  summary: {
    subtotal: number;
    gst: number;
    gstRate: number;
    total: number;
  };
  hasItems: boolean;
  itemCount: number;
}

export default function InvoicePage() {
  const params = useParams();
  const serviceId = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/invoices/${serviceId}`);

        if (!response.ok) {
          throw new Error("Failed to load invoice");
        }

        const data = await response.json();
        setInvoice(data);
      } catch (err: any) {
        setError(err.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchInvoice();
    }
  }, [serviceId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Invoice Not Found</h1>
        <p className="text-slate-500">
          {error || "This invoice does not exist."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} size="lg">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Container */}
      <div className="min-h-screen bg-slate-50 print:bg-white py-8 print:py-0">
        <div className="max-w-5xl mx-auto bg-white shadow-lg print:shadow-none">
          {/* A4 Paper Simulation */}
          <div className="p-8 print:p-6">
            {/* Header - Logo and Company Details */}
            <div className="border border-slate-900 mb-0">
              <div className="flex justify-between items-start p-4">
                {/* Logo */}
                <div className="w-32 h-20 border border-blue-600 bg-blue-600 flex items-center justify-center text-sm text-white font-bold">
                  LOGO
                </div>

                {/* Company Details */}
                <div className="text-right text-sm">
                  <p className="font-semibold">
                    {invoice.garage.address || "Address"}
                  </p>
                  <p>Email: {invoice.garage.email || "N/A"}</p>
                  <p>Mob: {invoice.garage.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Document Title and Type */}
            <div className="border-x border-b border-slate-900 flex justify-between items-center px-4 py-2">
              <h1 className="text-xl font-bold text-slate-900">
                Service Invoice
              </h1>
              <span className="text-sm font-semibold">Original</span>
            </div>

            {/* Bill To and Order Details Grid */}
            <div className="border-x border-b border-slate-900 grid grid-cols-2">
              {/* Bill To Section */}
              <div className="border-r border-slate-900 p-3">
                <p className="text-sm font-semibold mb-2">Bill To:</p>
                <p className="text-base font-bold">{invoice.customer.name}</p>
                <p className="text-sm">{invoice.customer.address || "N/A"}</p>
                <p className="text-sm mt-2">MOB: {invoice.customer.phone}</p>
                <div className="mt-3 pt-3 border-t border-slate-300">
                  <p className="text-sm">
                    <span className="font-semibold">GSTIN:</span>{" "}
                    {invoice.garage.gstNumber || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">PAN No:</span>
                  </p>
                </div>
              </div>

              {/* Order Details Section */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="p-2">
                    <p className="text-slate-600">Invoice No.</p>
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="p-2">
                    <p className="text-slate-600">Date</p>
                    <p className="font-semibold">
                      {invoice.invoiceDate &&
                        format(new Date(invoice.invoiceDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="p-2">
                    <p className="text-slate-600">Vehicle No.</p>
                    <p className="font-semibold">
                      {invoice.vehicle.numberPlate}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-slate-600">Model</p>
                    <p className="font-semibold">{invoice.vehicle.model}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2">
                    <p className="text-slate-600">Service Date</p>
                    <p className="font-semibold">
                      {format(
                        new Date(invoice.service.serviceDate),
                        "dd/MM/yyyy",
                      )}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-slate-600">Status</p>
                    <p className="font-semibold">{invoice.service.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border-x border-b border-slate-900">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 text-sm font-bold text-left w-12">
                      #
                    </th>
                    <th className="border border-slate-300 p-2 text-sm font-bold text-left">
                      Description
                    </th>
                    <th className="border border-slate-300 p-2 text-sm font-bold text-right w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.sno}>
                      <td className="border border-slate-300 p-2 text-sm text-center">
                        {item.sno}
                      </td>
                      <td className="border border-slate-300 p-2 text-sm">
                        {item.description}
                      </td>
                      <td className="border border-slate-300 p-2 text-sm text-right font-mono">
                        ₹
                        {item.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows for spacing */}
                  {Array.from({
                    length: Math.max(0, 8 - invoice.items.length),
                  }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="border border-slate-300 p-2 h-8">
                        &nbsp;
                      </td>
                      <td className="border border-slate-300 p-2">&nbsp;</td>
                      <td className="border border-slate-300 p-2">&nbsp;</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-100">
                    <td
                      colSpan={2}
                      className="border border-slate-300 p-2 text-sm font-bold text-right"
                    >
                      Total:
                    </td>
                    <td className="border border-slate-300 p-2 text-sm font-bold text-right font-mono">
                      ₹
                      {invoice.summary.subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer - Bank Details and Summary */}
            <div className="border-x-2 border-b-2 border-slate-900 grid grid-cols-2">
              {/* Left Side - Bank Details and Remarks */}
              <div className="border-r border-slate-900">
                {/* Remarks */}
                {invoice.service.notes && (
                  <div className="border-b border-slate-300 p-3">
                    <p className="text-sm font-semibold mb-1">Remarks:</p>
                    <p className="text-sm text-slate-700">
                      {invoice.service.notes}
                    </p>
                  </div>
                )}

                {/* Company GSTIN */}
                <div className="p-3">
                  <p className="text-sm">
                    <span className="font-semibold">Company GSTIN:</span>{" "}
                    {invoice.garage.gstNumber || "N/A"}
                  </p>
                  {invoice.service.nextServiceDate && (
                    <p className="text-sm mt-2">
                      <span className="font-semibold">Next Service Due:</span>{" "}
                      {format(
                        new Date(invoice.service.nextServiceDate),
                        "dd/MM/yyyy",
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side - Invoice Summary */}
              <div>
                <div className="border-b border-slate-300 p-3">
                  <p className="text-sm font-bold mb-2">Invoice Summary:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Taxable Value:</span>
                      <span className="font-mono">
                        ₹
                        {invoice.summary.subtotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SGST:</span>
                      <span className="font-mono">
                        ₹
                        {(invoice.summary.gst / 2).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CGST:</span>
                      <span className="font-mono">
                        ₹
                        {(invoice.summary.gst / 2).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IGST:</span>
                      <span className="font-mono">₹0.00</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Grand Total:</span>
                    <span className="font-mono">
                      ₹
                      {invoice.summary.total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center mt-4">
              <p className="text-sm font-semibold text-slate-600">
                Thank you for your business!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </>
  );
}
