"use client";

import { useState } from "react";
import type { Client } from "@/types/database";

interface ClientFormProps {
  client?: Client;
  action: (formData: FormData) => Promise<{ error: string } | void>;
  submitLabel: string;
}

export default function ClientForm({ client, action, submitLabel }: ClientFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Contact Information */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
            <input name="name" defaultValue={client?.name} required
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address <span className="text-red-400">*</span></label>
            <input name="email" type="email" defaultValue={client?.email} required
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
            <input name="phone" defaultValue={client?.phone ?? ""} placeholder="+264 81 000 0000"
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
            <input name="company" defaultValue={client?.company ?? ""} placeholder="Company or organisation"
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
            <input name="location" defaultValue={client?.location ?? ""} placeholder="City, Country"
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors" />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Notes</h2>
        <textarea name="notes" rows={4} defaultValue={client?.notes ?? ""} placeholder="Internal notes about this client..."
          className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none" />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-foreground border border-border rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-5 py-2 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
