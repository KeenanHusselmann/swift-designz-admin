"use client";

import { useActionState } from "react";
import type { AiAgent, AgentStatus } from "@/types/database";

const statuses: { value: AgentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "retired", label: "Retired" },
];

interface AgentFormProps {
  agent?: AiAgent;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

export default function AgentForm({ agent, action, submitLabel }: AgentFormProps) {
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
          placeholder="e.g. Swift Marketing Agent"
          defaultValue={agent?.name}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-xs font-medium text-gray-400 mb-1.5">Purpose *</label>
        <input
          id="purpose"
          name="purpose"
          type="text"
          required
          placeholder="e.g. Social media content generation"
          defaultValue={agent?.purpose}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="model" className="block text-xs font-medium text-gray-400 mb-1.5">Model *</label>
          <input
            id="model"
            name="model"
            type="text"
            required
            placeholder="e.g. GPT-4o, Claude Sonnet"
            defaultValue={agent?.model}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="provider" className="block text-xs font-medium text-gray-400 mb-1.5">Provider *</label>
          <input
            id="provider"
            name="provider"
            type="text"
            required
            placeholder="e.g. OpenAI, Anthropic"
            defaultValue={agent?.provider}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="monthly_cost" className="block text-xs font-medium text-gray-400 mb-1.5">Monthly Cost (R)</label>
          <input
            id="monthly_cost"
            name="monthly_cost"
            type="number"
            step="0.01"
            min="0"
            defaultValue={agent ? (agent.monthly_cost / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
          <select
            id="status"
            name="status"
            defaultValue={agent?.status || "active"}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="config_notes" className="block text-xs font-medium text-gray-400 mb-1.5">Configuration Notes</label>
        <textarea
          id="config_notes"
          name="config_notes"
          rows={4}
          placeholder="API keys, system prompts, integration details..."
          defaultValue={agent?.config_notes || ""}
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
