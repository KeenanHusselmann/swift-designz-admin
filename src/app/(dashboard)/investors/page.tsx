import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { Investor, IncomeEntry } from "@/types/database";

export default async function InvestorsPage() {
  const supabase = await createClient();

  const [{ data: investorsRaw }, { data: contributionsRaw }] = await Promise.all([
    supabase.from("investors").select("*").order("created_at", { ascending: false }),
    supabase.from("income_entries").select("investor_id, amount").eq("source", "investor"),
  ]);

  const investors = (investorsRaw || []) as Investor[];
  const contributions = (contributionsRaw || []) as Pick<IncomeEntry, "investor_id" | "amount">[];

  // Build a map of investor_id → total contributed (cents)
  const contributedMap = new Map<string, number>();
  for (const c of contributions) {
    if (c.investor_id) {
      contributedMap.set(c.investor_id, (contributedMap.get(c.investor_id) || 0) + c.amount);
    }
  }

  return (
    <>
      <PageHeader
        title="Investors"
        description="Investor profiles, agreements, and contributions"
        actions={
          <Link
            href="/investors/new"
            className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Investor
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Commitment</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contributed</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {investors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No investors added yet.
                  </td>
                </tr>
              ) : (
                investors.map((inv) => {
                  const contributed = contributedMap.get(inv.id) || 0;
                  return (
                    <tr key={inv.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/investors/${inv.id}`} className="text-sm font-medium text-foreground hover:text-teal">
                          {inv.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">{inv.company || "—"}</td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(inv.investment_amount)}</td>
                      <td className="px-5 py-3 text-sm text-green-400 font-medium">{formatCurrency(contributed)}</td>
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {inv.equity_percentage ? `${inv.equity_percentage}%` : "—"}
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
