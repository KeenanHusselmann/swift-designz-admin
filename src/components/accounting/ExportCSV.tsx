"use client";

import { Download } from "lucide-react";

interface ExportCSVProps {
  csv: string;
  filename: string;
}

export default function ExportCSV({ csv, filename }: ExportCSVProps) {
  function handleExport() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#30B0B0] border border-[#30B0B0]/40 hover:border-[#30B0B0] rounded-lg transition-colors"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </button>
  );
}
