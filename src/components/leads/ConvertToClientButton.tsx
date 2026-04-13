"use client";

import { useState } from "react";
import { convertLeadToClient } from "@/app/(dashboard)/leads/actions";
import { UserPlus } from "lucide-react";

interface Props {
  leadId: string;
}

export default function ConvertToClientButton({ leadId }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!confirm("Convert this lead to a client? This will create a new client and mark the lead as won.")) return;

    setPending(true);
    setError(null);
    const result = await convertLeadToClient(leadId);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleConvert}
        disabled={pending}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        {pending ? "Converting..." : "Convert to Client"}
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
