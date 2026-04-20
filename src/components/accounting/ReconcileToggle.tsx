"use client";

import { useTransition, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toggleReconcileAction } from "@/app/(dashboard)/accounting/income/actions";

interface ReconcileToggleProps {
  id: string;
  reconciled: boolean;
}

export default function ReconcileToggle({ id, reconciled: initialReconciled }: ReconcileToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [reconciled, setReconciled] = useState(initialReconciled);

  function handleToggle() {
    const next = !reconciled;
    setReconciled(next); // optimistic
    startTransition(async () => {
      const result = await toggleReconcileAction(id, next);
      if (result?.error) setReconciled(!next); // revert on error
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={reconciled ? "Mark as unreconciled" : "Mark as reconciled"}
      className={`flex items-center justify-center w-6 h-6 rounded transition-colors disabled:opacity-40 ${
        reconciled
          ? "text-teal hover:text-teal/70"
          : "text-gray-600 hover:text-gray-400"
      }`}
    >
      <CheckCircle2 className="h-4 w-4" />
    </button>
  );
}
