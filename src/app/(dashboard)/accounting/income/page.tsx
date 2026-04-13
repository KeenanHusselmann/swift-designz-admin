import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteIncomeAction } from "./actions";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { IncomeEntry } from "@/types/database";

const categoryLabels: Record<string, string> = {
  web_dev: "Web Dev",
  ecommerce: "E-Commerce",
  apps: "Apps",
  training: "Training",
  consulting: "Consulting",
  investment: "Investment",
  other: "Other",
};

export default async function IncomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("income_entries")
    .select("*")
    .order("date", { ascending: false });

  const entries = (data || []) as IncomeEntry[];

  return (
    <>
      <PageHeader
        title="Income"
        description="All revenue records"
        actions={
          <Link
            href="/accounting/income/new"
            className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Income
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">No income records yet.</td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="hover:bg-card transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-400">{formatDate(e.date)}</td>
                  <td className="px-5 py-3 text-sm text-foreground">
                    <Link href={`/accounting/income/${e.id}/edit`} className="hover:text-teal">
                      {e.description}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{categoryLabels[e.category] || e.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 capitalize">{e.source}</td>
                  <td className="px-5 py-3 text-sm text-green-400 text-right font-mono font-medium">{formatCurrency(e.amount)}</td>
                  <td className="px-2 py-3 text-center">
                    <form action={async () => { "use server"; await deleteIncomeAction(e.id); }}>
                      <button type="submit" className="text-gray-600 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
