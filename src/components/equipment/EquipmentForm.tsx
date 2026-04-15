"use client";

import { useActionState } from "react";
import type { Equipment, EquipmentCategory, EquipmentCondition, EquipmentStatus } from "@/types/database";

const categories: { value: EquipmentCategory; label: string }[] = [
  { value: "computing", label: "Computing" },
  { value: "peripherals", label: "Peripherals" },
  { value: "mobile", label: "Mobile" },
  { value: "networking", label: "Networking" },
  { value: "software_licence", label: "Software Licence" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const conditions: { value: EquipmentCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const statuses: { value: EquipmentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "disposed", label: "Disposed" },
];

interface EquipmentFormProps {
  equipment?: Equipment;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

export default function EquipmentForm({ equipment, action, submitLabel }: EquipmentFormProps) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. MacBook Pro 14-inch"
            defaultValue={equipment?.name}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
          <select
            id="category"
            name="category"
            required
            defaultValue={equipment?.category || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="block text-xs font-medium text-gray-400 mb-1.5">Brand</label>
          <input
            id="brand"
            name="brand"
            type="text"
            placeholder="e.g. Apple, Dell, Samsung"
            defaultValue={equipment?.brand || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-xs font-medium text-gray-400 mb-1.5">Model</label>
          <input
            id="model"
            name="model"
            type="text"
            placeholder="e.g. MacBook Pro 14-inch, OptiPlex 3050"
            defaultValue={equipment?.model || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="serial_number" className="block text-xs font-medium text-gray-400 mb-1.5">Serial Number</label>
          <input
            id="serial_number"
            name="serial_number"
            type="text"
            placeholder="Optional"
            defaultValue={equipment?.serial_number || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="purchased_at" className="block text-xs font-medium text-gray-400 mb-1.5">Purchase Date</label>
          <input
            id="purchased_at"
            name="purchased_at"
            type="date"
            defaultValue={equipment?.purchased_at || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="purchase_price" className="block text-xs font-medium text-gray-400 mb-1.5">Purchase Price (R)</label>
          <input
            id="purchase_price"
            name="purchase_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={equipment ? (equipment.purchase_price / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="current_value" className="block text-xs font-medium text-gray-400 mb-1.5">Current Value (R)</label>
          <input
            id="current_value"
            name="current_value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={equipment ? (equipment.current_value / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="condition" className="block text-xs font-medium text-gray-400 mb-1.5">Condition</label>
          <select
            id="condition"
            name="condition"
            defaultValue={equipment?.condition || "good"}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
          <select
            id="status"
            name="status"
            defaultValue={equipment?.status || "active"}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div />
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Optional notes about this item..."
          defaultValue={equipment?.notes || ""}
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
