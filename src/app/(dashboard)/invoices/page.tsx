import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import DeleteInvoiceButton from "@/components/invoices/DeleteInvoiceButton";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

function DocTypeBadge({ type }: { type: string }) {
  const isQuote = type === "quotation";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
      isQuote
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        : "bg-teal/10 text-teal border border-teal/20"
    }`}>
      {isQuote ? "Quote" : "Invoice"}
    </span>
  );
}

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: allDocs } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  const invoices = (allDocs || []).filter((d) => d.doc_type !== "quotation");
  const quotations = (allDocs || []).filter((d) => d.doc_type === "quotation");

  return (
    <>
      <PageHeader
        title="Invoices & Quotations"
        description="Manage billing, quotations, and track payments"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/invoices/new?type=quotation"
              className="px-4 py-2 border border-teal/40 hover:border-teal text-teal text-sm font-medium rounded-lg transition-colors"
            >
              New Quotation
            </Link>
            <Link
              href="/invoices/new"
              className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              New Invoice
            </Link>
          </div>
        }
      />

      {/* Invoices Table */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Invoices</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/invoices/${inv.id}`} className="text-sm font-medium text-foreground hover:text-teal font-mono">
                          {inv.invoice_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {(inv as Record<string, unknown> & { clients: { name: string } | null }).clients?.name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(inv.amount)}</td>
                      <td className="px-5 py-3 text-sm text-gray-400">{formatCurrency(inv.paid_amount)}</td>
                      <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-5 py-3 text-sm text-gray-500">{formatDate(inv.due_date)}</td>
                      <td className="px-5 py-3 text-right">
                        <DeleteInvoiceButton id={inv.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Quotations</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      No quotations yet.
                    </td>
                  </tr>
                ) : (
                  quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/invoices/${q.id}`} className="text-sm font-medium text-foreground hover:text-teal font-mono">
                          {q.invoice_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {(q as Record<string, unknown> & { clients: { name: string } | null }).clients?.name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(q.amount)}</td>
                      <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                      <td className="px-5 py-3 text-sm text-gray-500">{formatDate(q.due_date)}</td>
                      <td className="px-5 py-3 text-right">
                        <DeleteInvoiceButton id={q.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
