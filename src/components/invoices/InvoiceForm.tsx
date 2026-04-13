"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Invoice, InvoiceItem, Client, Project, InvoiceDocType, InstallmentInterval } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

const INVOICE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

interface LineItem {
  description: string;
  quantity: number;
  unit_rate: number; // cents
}

interface InvoiceFormProps {
  invoice?: Invoice;
  existingItems?: InvoiceItem[];
  clients: Client[];
  projects: Project[];
  preselectedClientId?: string;
  preselectedProjectId?: string;
  preselectedDocType?: InvoiceDocType;
  action: (formData: FormData) => Promise<{ error: string } | void>;
  submitLabel: string;
}

export default function InvoiceForm({
  invoice,
  existingItems,
  clients,
  projects,
  preselectedClientId,
  preselectedProjectId,
  preselectedDocType,
  action,
  submitLabel,
}: InvoiceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(
    invoice?.client_id || preselectedClientId || ""
  );
  const [docType, setDocType] = useState<InvoiceDocType>(invoice?.doc_type || preselectedDocType || "invoice");
  const [paymentPlan, setPaymentPlan] = useState(invoice?.payment_plan_enabled || false);
  const [installmentCount, setInstallmentCount] = useState(invoice?.installment_count || 3);
  const [installmentInterval, setInstallmentInterval] = useState<InstallmentInterval>(
    (invoice?.installment_interval as InstallmentInterval) || "monthly"
  );

  const initialItems: LineItem[] = existingItems?.length
    ? existingItems.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_rate: it.unit_rate,
      }))
    : [{ description: "", quantity: 1, unit_rate: 0 }];

  const [items, setItems] = useState<LineItem[]>(initialItems);
  const formRef = useRef<HTMLFormElement>(null);

  // Filter projects by selected client
  const clientProjects = projects.filter((p) => p.client_id === selectedClientId);

  const total = items.reduce((sum, item) => sum + Math.round(item.quantity * item.unit_rate), 0);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unit_rate: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    if (field === "description") {
      updated[index].description = value as string;
    } else if (field === "quantity") {
      updated[index].quantity = Math.max(0, Number(value));
    } else if (field === "unit_rate") {
      // Input is in Rand, store as cents
      updated[index].unit_rate = Math.round(Number(value) * 100);
    }
    setItems(updated);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Inject items as JSON
    formData.set("items", JSON.stringify(items));
    formData.set("doc_type", docType);
    formData.set("payment_plan_enabled", paymentPlan ? "true" : "false");
    if (paymentPlan) {
      formData.set("installment_count", String(installmentCount));
      formData.set("installment_interval", installmentInterval);
    }

    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal";
  const labelCls = "block text-xs text-gray-400 mb-1";

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Document Type Toggle */}
      <div>
        <label className={labelCls}>Document Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDocType("invoice")}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              docType === "invoice"
                ? "bg-teal text-white border-teal"
                : "bg-transparent text-gray-400 border-border hover:border-teal/50"
            }`}
          >
            Invoice
          </button>
          <button
            type="button"
            onClick={() => setDocType("quotation")}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              docType === "quotation"
                ? "bg-teal text-white border-teal"
                : "bg-transparent text-gray-400 border-border hover:border-teal/50"
            }`}
          >
            Quotation
          </button>
        </div>
      </div>

      {/* Client + Project */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Client *</label>
          <select
            name="client_id"
            required
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className={inputCls}
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Project <span className="text-gray-600">(optional)</span></label>
          <select
            name="project_id"
            defaultValue={invoice?.project_id || preselectedProjectId || ""}
            className={inputCls}
          >
            <option value="">No project</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Due Date *</label>
          <input
            name="due_date"
            type="date"
            required
            defaultValue={invoice?.due_date || ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            name="status"
            defaultValue={invoice?.status || "draft"}
            className={inputCls}
          >
            {INVOICE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Line Items</label>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs text-teal hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Item
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-3 py-2 text-xs text-gray-500 uppercase tracking-wider w-20">Qty</th>
                <th className="text-left px-3 py-2 text-xs text-gray-500 uppercase tracking-wider w-28">Rate (R)</th>
                <th className="text-right px-3 py-2 text-xs text-gray-500 uppercase tracking-wider w-28">Amount</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, i) => {
                const lineAmount = Math.round(item.quantity * item.unit_rate);
                return (
                  <tr key={i}>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Service description"
                        value={item.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                        className="w-full bg-transparent border-0 text-sm text-foreground placeholder-gray-600 focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => updateItem(i, "quantity", e.target.value)}
                        className="w-full bg-transparent border-0 text-sm text-foreground text-center focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_rate / 100}
                        onChange={(e) => updateItem(i, "unit_rate", e.target.value)}
                        className="w-full bg-transparent border-0 text-sm text-foreground text-center focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-gray-300 font-mono">
                      {formatCurrency(lineAmount)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border">
                <td colSpan={3} className="px-3 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</td>
                <td className="px-3 py-3 text-right text-sm font-bold text-teal font-mono">
                  {formatCurrency(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes <span className="text-gray-600">(optional)</span></label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={invoice?.notes || ""}
          placeholder="Any additional notes..."
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Payment Plan */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentPlan}
              onChange={(e) => setPaymentPlan(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-teal transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm text-foreground font-medium">Payment Plan</span>
        </div>

        {paymentPlan && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className={labelCls}>Number of Installments</label>
              <input
                type="number"
                min="2"
                max="24"
                value={installmentCount}
                onChange={(e) => setInstallmentCount(Math.max(2, Number(e.target.value)))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Interval</label>
              <select
                value={installmentInterval}
                onChange={(e) => setInstallmentInterval(e.target.value as InstallmentInterval)}
                className={inputCls}
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {total > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">
                  {installmentCount} payments of{" "}
                  <span className="text-teal font-semibold">
                    {formatCurrency(Math.ceil(total / installmentCount))}
                  </span>{" "}
                  ({installmentInterval})
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
