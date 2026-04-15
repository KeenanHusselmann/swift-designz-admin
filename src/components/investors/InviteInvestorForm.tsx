"use client";

import { useActionState } from "react";

interface InviteInvestorFormProps {
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
}

export default function InviteInvestorForm({ action }: InviteInvestorFormProps) {
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
        <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Jane Smith"
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">Email Address *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="investor@example.com"
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <div className="p-3 bg-teal/5 border border-teal/20 rounded-lg text-xs text-gray-400">
        An invitation email will be sent. Once accepted, the investor will have read-only access to the Dashboard, Projects, Investors, and Reports pages.
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {pending ? "Sending Invite..." : "Send Invitation"}
      </button>
    </form>
  );
}
