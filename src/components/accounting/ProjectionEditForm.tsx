"use client";

import { useActionState, useRef } from "react";
import { upsertProjectionAction } from "@/app/(dashboard)/accounting/projections/actions";

interface ProjectionEditFormProps {
  month: string;       // YYYY-MM-01
  monthLabel: string;
  currentIncome: number;    // cents
  currentExpenses: number;  // cents
  onClose: () => void;
}

const INPUT = "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal";

export default function ProjectionEditForm({
  month,
  monthLabel,
  currentIncome,
  currentExpenses,
  onClose,
}: ProjectionEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const result = await upsertProjectionAction(formData);
      if (!result?.error) onClose();
      return result;
    },
    undefined,
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="month" value={month} />
      {state?.error && (
        <p className="text-xs text-red-400">{state.error}</p>
      )}
      <p className="text-sm font-medium text-foreground">{monthLabel}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Projected Income (R)</label>
          <input
            name="projected_income"
            type="number" step="0.01" min="0"
            defaultValue={currentIncome > 0 ? (currentIncome / 100).toFixed(2) : ""}
            placeholder="0.00"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Projected Expenses (R)</label>
          <input
            name="projected_expenses"
            type="number" step="0.01" min="0"
            defaultValue={currentExpenses > 0 ? (currentExpenses / 100).toFixed(2) : ""}
            placeholder="0.00"
            className={INPUT}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Notes</label>
        <input name="notes" type="text" placeholder="Optional" className={INPUT} />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-3 py-1.5 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
