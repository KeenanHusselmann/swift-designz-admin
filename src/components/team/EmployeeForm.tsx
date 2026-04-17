"use client";

import { useActionState } from "react";
import type { Employee, Department, EmployeeStatus } from "@/types/database";
import { useToast } from "@/components/ui/ToastProvider";

const departments: { value: Department; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const statuses: { value: EmployeeStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
];

interface EmployeeFormProps {
  employee?: Employee;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

export default function EmployeeForm({ employee, action, submitLabel }: EmployeeFormProps) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      toast.loading(employee ? "Saving changes..." : "Adding employee...");
      const result = await action(formData);
      if (result?.error) toast.error(result.error);
      else toast.success(employee ? "Employee updated!" : "Employee added!");
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
            defaultValue={employee?.name}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-xs font-medium text-gray-400 mb-1.5">Role *</label>
          <input
            id="role"
            name="role"
            type="text"
            required
            placeholder="e.g. Frontend Developer"
            defaultValue={employee?.role}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={employee?.email || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={employee?.phone || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="department" className="block text-xs font-medium text-gray-400 mb-1.5">Department *</label>
          <select
            id="department"
            name="department"
            required
            defaultValue={employee?.department || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="salary" className="block text-xs font-medium text-gray-400 mb-1.5">Monthly Salary (R) *</label>
          <input
            id="salary"
            name="salary"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={employee ? (employee.salary / 100).toFixed(2) : ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
          <select
            id="status"
            name="status"
            defaultValue={employee?.status || "active"}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-xs font-medium text-gray-400 mb-1.5">Start Date *</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            defaultValue={employee?.start_date || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-xs font-medium text-gray-400 mb-1.5">End Date</label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={employee?.end_date || ""}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={employee?.notes || ""}
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
