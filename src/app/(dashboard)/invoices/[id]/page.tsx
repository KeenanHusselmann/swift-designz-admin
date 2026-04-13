import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import DeleteInvoiceButton from "@/components/invoices/DeleteInvoiceButton";
import PaymentForm from "@/components/invoices/PaymentForm";
import { deletePaymentAction } from "@/app/(dashboard)/invoices/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit, FileText, Download, ExternalLink, Trash2 } from "lucide-react";
import type { Payment } from "@/types/database";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: invoice },
    { data: items },
    { data: payments },
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, clients(id, name, email, phone, company), projects(id, name)")
      .eq("id", id)
      .single(),
    supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("sort_order"),
    supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", id)
      .order("paid_at", { ascending: false }),
  ]);

  if (!invoice) notFound();

  const client = invoice.clients as { id: string; name: string; email: string; phone: string | null; company: string | null } | null;
  const project = invoice.projects as { id: string; name: string } | null;
  const outstanding = invoice.amount - invoice.paid_amount;

  return (
    <>
      <PageHeader
        title={invoice.invoice_number}
        description={client?.name || "Invoice"}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/api/docs/${client?.id || ""}/invoice-template`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#30B0B0] border border-[#30B0B0]/40 hover:border-[#30B0B0] rounded-lg transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Preview HTML
            </Link>
            <Link
              href={`/api/invoices/${id}/pdf`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#30B0B0] border border-[#30B0B0]/40 hover:border-[#30B0B0] rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Link>
            <Link
              href={`/invoices/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white border border-[#2a2a2a] hover:border-[#30B0B0] rounded-lg transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Link>
            <DeleteInvoiceButton id={id} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Line Items */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Line Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Rate</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {(items || []).map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 text-sm text-white">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 text-right font-mono">{formatCurrency(item.unit_rate)}</td>
                    <td className="px-6 py-3 text-sm text-white text-right font-mono font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#2a2a2a]">
                  <td colSpan={3} className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-white font-mono">{formatCurrency(invoice.amount)}</td>
                </tr>
                {invoice.paid_amount > 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</td>
                    <td className="px-6 py-2 text-right text-sm font-bold text-green-400 font-mono">-{formatCurrency(invoice.paid_amount)}</td>
                  </tr>
                )}
                <tr className="border-t border-[#30B0B0]/30">
                  <td colSpan={3} className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount Due</td>
                  <td className="px-6 py-3 text-right text-base font-bold text-[#30B0B0] font-mono">{formatCurrency(outstanding)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment History */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment History</h2>
            </div>
            {(!payments || payments.length === 0) ? (
              <p className="px-6 py-8 text-sm text-center text-gray-500">No payments recorded yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {(payments as Payment[]).map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#1a1a1a]">
                      <td className="px-6 py-3 text-sm text-gray-300">{formatDate(pay.paid_at)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 capitalize">{pay.method}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {pay.reference || "—"}
                        {pay.proof_url && (
                          <a
                            href={pay.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-0.5 text-[#30B0B0] hover:underline text-xs"
                          >
                            Proof <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-white text-right font-mono font-medium">{formatCurrency(pay.amount)}</td>
                      <td className="px-2 py-3 text-center">
                        <form action={async () => {
                          "use server";
                          await deletePaymentAction(pay.id, id);
                        }}>
                          <button
                            type="submit"
                            className="text-gray-600 hover:text-red-400 transition-colors"
                            title="Delete payment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="glass-card p-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notes</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Details */}
          <div className="glass-card p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Details</h2>
            <dl className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-xs text-gray-500">Status</dt>
                <dd><StatusBadge status={invoice.status} /></dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-xs text-gray-500">Client</dt>
                <dd>
                  {client ? (
                    <Link href={`/clients/${client.id}`} className="text-sm text-[#30B0B0] hover:underline">
                      {client.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </dd>
              </div>
              {project && (
                <div className="flex justify-between items-center">
                  <dt className="text-xs text-gray-500">Project</dt>
                  <dd>
                    <Link href={`/projects/${project.id}`} className="text-sm text-[#30B0B0] hover:underline">
                      {project.name}
                    </Link>
                  </dd>
                </div>
              )}
              <div className="flex justify-between items-center">
                <dt className="text-xs text-gray-500">Due Date</dt>
                <dd className="text-sm text-gray-300">{formatDate(invoice.due_date)}</dd>
              </div>
              {invoice.paid_date && (
                <div className="flex justify-between items-center">
                  <dt className="text-xs text-gray-500">Paid Date</dt>
                  <dd className="text-sm text-green-400">{formatDate(invoice.paid_date)}</dd>
                </div>
              )}
              <div className="flex justify-between items-center">
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-xs text-gray-400">{formatDate(invoice.created_at)}</dd>
              </div>
            </dl>
          </div>

          {/* Financial */}
          <div className="glass-card p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2a2a]">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-sm font-semibold text-white">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2a2a]">
                <span className="text-xs text-gray-500">Paid</span>
                <span className="text-sm font-semibold text-green-400">{formatCurrency(invoice.paid_amount)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-gray-500">Outstanding</span>
                <span className={`text-sm font-semibold ${outstanding > 0 ? "text-amber-400" : "text-gray-400"}`}>
                  {formatCurrency(outstanding)}
                </span>
              </div>
            </div>
          </div>

          {/* Record Payment */}
          {outstanding > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Record Payment</h2>
              <PaymentForm invoiceId={id} outstandingCents={outstanding} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
