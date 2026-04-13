import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Manage billing and track payments"
        actions={
          <Link
            href="/invoices/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create Invoice
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!invoices || invoices.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/invoices/${inv.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0] font-mono">
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {(inv as Record<string, unknown> & { clients: { name: string } | null }).clients?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-white font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{formatCurrency(inv.paid_amount)}</td>
                    <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(inv.due_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
