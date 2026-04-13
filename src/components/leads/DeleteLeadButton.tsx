"use client";

import { useState } from "react";
import { deleteLead } from "@/app/(dashboard)/leads/actions";
import { Trash2 } from "lucide-react";

interface Props {
  leadId: string;
}

export default function DeleteLeadButton({ leadId }: Props) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;

    setPending(true);
    await deleteLead(leadId);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-transparent hover:bg-red-500/10 text-red-400 text-sm font-medium rounded-lg border border-red-500/20 hover:border-red-500/40 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
