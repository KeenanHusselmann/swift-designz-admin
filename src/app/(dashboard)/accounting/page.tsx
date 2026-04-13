import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";
import Link from "next/link";

export default async function AccountingPage() {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const [incomeResult, expensesResult] = await Promise.all([
    supabase
      .from("income_entries")
      .select("amount")
      .gte("date", startOfMonth)
      .lte("date", endOfMonth),
    supabase
      .from("expenses")
      .select("amount")
      .gte("date", startOfMonth)
      .lte("date", endOfMonth),
  ]);

  const income = (incomeResult.data ?? []) as { amount: number }[];
  const expenses = (expensesResult.data ?? []) as { amount: number }[];

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <>
      <PageHeader
        title="Accounting"
        description="Income, expenses, and financial overview"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Income (MTD)" value={formatCurrency(totalIncome)} icon={TrendingUp} />
        <KpiCard title="Expenses (MTD)" value={formatCurrency(totalExpenses)} icon={TrendingDown} />
        <KpiCard
          title="Net Profit (MTD)"
          value={formatCurrency(Math.abs(netProfit))}
          subtitle={netProfit >= 0 ? "Profit" : "Loss"}
          icon={DollarSign}
          trend={netProfit >= 0 ? "up" : "down"}
        />
        <KpiCard title="Transactions" value={String((income?.length || 0) + (expenses?.length || 0))} icon={Receipt} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/accounting/income" className="glass-card p-6 text-center hover:border-teal/30 transition-colors">
          <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <h3 className="text-foreground font-medium">Income</h3>
          <p className="text-sm text-gray-500 mt-1">Track all revenue</p>
        </Link>
        <Link href="/accounting/expenses" className="glass-card p-6 text-center hover:border-teal/30 transition-colors">
          <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-3" />
          <h3 className="text-foreground font-medium">Expenses</h3>
          <p className="text-sm text-gray-500 mt-1">Track all spending</p>
        </Link>
        <Link href="/accounting/reports" className="glass-card p-6 text-center hover:border-teal/30 transition-colors">
          <Receipt className="h-8 w-8 text-teal mx-auto mb-3" />
          <h3 className="text-foreground font-medium">Reports</h3>
          <p className="text-sm text-gray-500 mt-1">P&L statements</p>
        </Link>
      </div>
    </>
  );
}
