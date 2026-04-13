"use client";

import { useActionState } from "react";
import type { Investor, InvestorStatus } from "@/types/database";

const statuses: { value: InvestorStatus; label: string }[] = [
  { value: "prospective", label: "Prospective" },
  { value: "active", label: "Active" },
  { value: "exited", label: "Exited" },
];

interface InvestorFormProps {
  investor?: Investor;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

export default function InvestorForm({ investor, action, submitLabel }: InvestorFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const result = await action(formData);
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
        <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={investor?.name}
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={investor?.email || ""}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={investor?.phone || ""}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          defaultValue={investor?.company || ""}
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="investment_amount" className="block text-xs font-medium text-gray-400 mb-1.5">Investment Amount (R) *</label>
          <input
            id="investment_amount"
            name="investment_amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={investor ? (investor.investment_amount / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="equity_percentage" className="block text-xs font-medium text-gray-400 mb-1.5">Equity (%)</label>
          <input
            id="equity_percentage"
            name="equity_percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            defaultValue={investor?.equity_percentage ?? ""}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="agreement_date" className="block text-xs font-medium text-gray-400 mb-1.5">Agreement Date</label>
          <input
            id="agreement_date"
            name="agreement_date"
            type="date"
            defaultValue={investor?.agreement_date || ""}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
        <select
          id="status"
          name="status"
          defaultValue={investor?.status || "prospective"}
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={investor?.notes || ""}
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-[#30B0B0] focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
