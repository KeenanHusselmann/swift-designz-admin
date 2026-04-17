"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInvestorAction } from "@/app/(dashboard)/investors/actions";
import { useToast } from "@/components/ui/ToastProvider";

export default function DeleteInvestorButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm("Delete this investor? This cannot be undone.")) return;
        setLoading(true);
        toast.loading("Deleting investor...");
        await deleteInvestorAction(id);
        toast.success("Investor deleted.");
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 border border-red-500/30 hover:border-red-500 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
