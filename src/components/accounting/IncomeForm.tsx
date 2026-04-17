"use client";

import { useActionState } from "react";
import type { IncomeEntry, IncomeCategory } from "@/types/database";
import { useToast } from "@/components/ui/ToastProvider";

const categories: { value: IncomeCategory; label: string }[] = [
  { value: "web_dev", label: "Web Development" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "apps", label: "Apps" },
  { value: "training", label: "Training" },
  { value: "consulting", label: "Consulting" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
];

interface IncomeFormProps {
  entry?: IncomeEntry;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

export default function IncomeForm({ entry, action, submitLabel }: IncomeFormProps) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      toast.loading(entry ? "Saving changes..." : "Saving income entry...");
      const result = await action(formData);
      if (result?.error) toast.error(result.error);
      else toast.success(entry ? "Entry updated!" : "Income entry saved!");
      return result ?? undefined;
    },
    undefined,
  );

  return (
    <form action={formAction} className="glass-card p-6 space-y-5">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">{state.error}</div>
      )}

      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          required
          defaultValue={entry?.description}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1.5">Amount (R)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={entry ? (entry.amount / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={entry?.date || new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
        <select
          id="category"
          name="category"
          required
          defaultValue={entry?.category || ""}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={entry?.notes || ""}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
