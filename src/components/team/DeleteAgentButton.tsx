"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAgentAction } from "@/app/(dashboard)/team/agents/actions";
import { useToast } from "@/components/ui/ToastProvider";

export default function DeleteAgentButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm("Delete this AI agent? This cannot be undone.")) return;
        setLoading(true);
        toast.loading("Deleting agent...");
        await deleteAgentAction(id);
        toast.success("Agent deleted.");
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 border border-red-500/30 hover:border-red-500 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
