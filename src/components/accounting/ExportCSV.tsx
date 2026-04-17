"use client";

import { Download } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface ExportCSVProps {
  csv: string;
  filename: string;
}

export default function ExportCSV({ csv, filename }: ExportCSVProps) {
  const toast = useToast();

  function handleExport() {
    toast.loading("Exporting CSV...");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal border border-teal/40 hover:border-teal rounded-lg transition-colors"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </button>
  );
}
