"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function PrintInvestorStatementButton({ investorId }: { investorId: string }) {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const toast = useToast();

  function handlePrint() {
    toast.success("Opening statement...");
    window.open(`/api/investors/${investorId}/statement?month=${month}`, "_blank");
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="px-2 py-1.5 text-sm bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-teal"
      />
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground border border-border hover:border-teal rounded-lg transition-colors"
      >
        <FileText className="h-3.5 w-3.5" />
        Statement
      </button>
    </div>
  );
}
