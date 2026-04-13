import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function InvestorsPage() {
  const supabase = await createClient();
  const { data: investors } = await supabase
    .from("investors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Investors"
        description="Investor profiles and agreements"
        actions={
          <Link
            href="/investors/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Investor
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!investors || investors.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                    No investors added yet.
                  </td>
                </tr>
              ) : (
                investors.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/investors/${inv.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0]">
                        {inv.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{inv.company || "—"}</td>
                    <td className="px-5 py-3 text-sm text-white font-medium">{formatCurrency(inv.investment_amount)}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {inv.equity_percentage ? `${inv.equity_percentage}%` : "—"}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
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
