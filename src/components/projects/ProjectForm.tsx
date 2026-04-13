"use client";

import { useState } from "react";
import type { Project, Client } from "@/types/database";

const PROJECT_STATUSES = [
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
];

const SERVICES = [
  "Website Development",
  "E-Commerce",
  "App / Software",
  "AI Training",
  "PM Training",
  "Consulting",
  "Other",
];

interface ProjectFormProps {
  project?: Project;
  clients: Client[];
  preselectedClientId?: string;
  action: (formData: FormData) => Promise<{ error: string } | void>;
  submitLabel: string;
  isEdit?: boolean;
}

export default function ProjectForm({
  project,
  clients,
  preselectedClientId,
  action,
  submitLabel,
  isEdit = false,
}: ProjectFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientMode, setClientMode] = useState<"existing" | "new">(
    preselectedClientId ? "existing" : "existing"
  );

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  // Convert quoted_amount from cents to display value
  const quotedDisplay = project?.quoted_amount
    ? (project.quoted_amount / 100).toFixed(2)
    : "";

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Client Section */}
      {!isEdit && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Client</h2>
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setClientMode("existing")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                clientMode === "existing"
                  ? "bg-[#30B0B0]/10 border-[#30B0B0]/60 text-[#30B0B0]"
                  : "border-[#2a2a2a] text-gray-400 hover:text-white"
              }`}
            >
              Existing Client
            </button>
            <button
              type="button"
              onClick={() => setClientMode("new")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                clientMode === "new"
                  ? "bg-[#30B0B0]/10 border-[#30B0B0]/60 text-[#30B0B0]"
                  : "border-[#2a2a2a] text-gray-400 hover:text-white"
              }`}
            >
              New Client
            </button>
          </div>

          <input type="hidden" name="client_mode" value={clientMode} />

          {clientMode === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Select Client <span className="text-red-400">*</span>
              </label>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-500">No clients yet. Switch to &ldquo;New Client&rdquo; to create one.</p>
              ) : (
                <select
                  name="client_id"
                  defaultValue={preselectedClientId || ""}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.company ? ` — ${c.company}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Client Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="new_client_name"
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Client Email <span className="text-red-400">*</span>
                </label>
                <input
                  name="new_client_email"
                  type="email"
                  placeholder="client@email.com"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                <input
                  name="new_client_phone"
                  placeholder="+264 81 000 0000"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
                <input
                  name="new_client_company"
                  placeholder="Company or organisation"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Details */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Project Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              defaultValue={project?.name}
              required
              placeholder="e.g. Swift Designz E-Commerce Store"
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Service Type</label>
            <select
              name="service"
              defaultValue={project?.service || ""}
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            >
              <option value="">Select service...</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Package</label>
            <input
              name="package"
              defaultValue={project?.package ?? ""}
              placeholder="e.g. Starter, Pro, Custom"
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={project?.status || "planning"}
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Quoted Amount (R)</label>
            <input
              name="quoted_amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={quotedDisplay}
              placeholder="0.00"
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Start Date</label>
            <input
              name="start_date"
              type="date"
              defaultValue={project?.start_date ?? ""}
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Due Date</label>
            <input
              name="due_date"
              type="date"
              defaultValue={project?.due_date ?? ""}
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Notes</h2>
        <textarea
          name="notes"
          rows={4}
          defaultValue={project?.notes ?? ""}
          placeholder="Project scope, requirements, or internal notes..."
          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#30B0B0] focus:ring-1 focus:ring-[#30B0B0] transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-[#2a2a2a] rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
