"use client";

import { useActionState } from "react";

interface ContributionFormProps {
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
}

export default function ContributionForm({ action }: ContributionFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const result = await action(formData);
      return result ?? undefined;
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">{state.error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1.5">Description *</label>
          <input
            id="description"
            name="description"
            type="text"
            required
            placeholder="Monthly contribution"
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1.5">Amount (R) *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-xs font-medium text-gray-400 mb-1.5">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <input
          id="notes"
          name="notes"
          type="text"
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {pending ? "Recording..." : "Record Contribution"}
      </button>
    </form>
  );
}
