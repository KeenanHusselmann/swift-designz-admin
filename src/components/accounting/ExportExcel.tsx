"use client";

import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ExportExcel() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleExport() {
    setLoading(true);
    toast.loading("Generating Excel report…");
    try {
      const res = await fetch("/api/accounting/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+)"/);
      a.download = match?.[1] ?? "SwiftDesignz-PnL.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel report downloaded!");
    } catch {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal border border-teal/40 hover:border-teal rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-3.5 w-3.5" />
      )}
      Export Excel
    </button>
  );
}
