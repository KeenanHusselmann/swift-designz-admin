import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils";
import ExportCSV from "@/components/accounting/ExportCSV";
import type { IncomeEntry, Expense } from "@/types/database";

const incomeCategoryLabels: Record<string, string> = {
  web_dev: "Web Development",
  ecommerce: "E-Commerce",
  apps: "Apps",
  training: "Training",
  consulting: "Consulting",
  investment: "Investment",
  other: "Other",
};

const expenseCategoryLabels: Record<string, string> = {
  hosting: "Hosting",
  software: "Software",
  subscriptions: "Subscriptions",
  hardware: "Hardware",
  marketing: "Marketing",
  transport: "Transport",
  office: "Office",
  professional_services: "Professional Services",
  other: "Other",
};

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string) {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1);
  return date.toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
}

export default async function ReportsPage() {
  const supabase = await createClient();

  const now = new Date();
  const yearStart = `${now.getFullYear()}-01-01`;

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from("income_entries").select("*").gte("date", yearStart).order("date"),
    supabase.from("expenses").select("*").gte("date", yearStart).order("date"),
  ]);

  const income = (incomeData || []) as IncomeEntry[];
  const expenses = (expenseData || []) as Expense[];

  // Aggregate by month
  const months = new Set<string>();
  income.forEach((i) => months.add(getMonthKey(i.date)));
  expenses.forEach((e) => months.add(getMonthKey(e.date)));
  const sortedMonths = [...months].sort();

  // Income by category per month
  const incomeByCategory: Record<string, Record<string, number>> = {};
  income.forEach((i) => {
    const mk = getMonthKey(i.date);
    if (!incomeByCategory[i.category]) incomeByCategory[i.category] = {};
    incomeByCategory[i.category][mk] = (incomeByCategory[i.category][mk] || 0) + i.amount;
  });

  // Expense by category per month
  const expenseByCategory: Record<string, Record<string, number>> = {};
  expenses.forEach((e) => {
    const mk = getMonthKey(e.date);
    if (!expenseByCategory[e.category]) expenseByCategory[e.category] = {};
    expenseByCategory[e.category][mk] = (expenseByCategory[e.category][mk] || 0) + e.amount;
  });

  // Monthly totals
  const monthlyIncome: Record<string, number> = {};
  const monthlyExpenses: Record<string, number> = {};
  sortedMonths.forEach((m) => {
    monthlyIncome[m] = Object.values(incomeByCategory).reduce((s, cats) => s + (cats[m] || 0), 0);
    monthlyExpenses[m] = Object.values(expenseByCategory).reduce((s, cats) => s + (cats[m] || 0), 0);
  });

  // YTD totals
  const ytdIncome = income.reduce((s, i) => s + i.amount, 0);
  const ytdExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const ytdNet = ytdIncome - ytdExpenses;

  // CSV data for export
  const csvRows: string[][] = [["Month", "Type", "Category", "Amount"]];
  sortedMonths.forEach((m) => {
    Object.entries(incomeByCategory).forEach(([cat, vals]) => {
      if (vals[m]) csvRows.push([getMonthLabel(m), "Income", incomeCategoryLabels[cat] || cat, (vals[m] / 100).toFixed(2)]);
    });
    Object.entries(expenseByCategory).forEach(([cat, vals]) => {
      if (vals[m]) csvRows.push([getMonthLabel(m), "Expense", expenseCategoryLabels[cat] || cat, (vals[m] / 100).toFixed(2)]);
    });
  });
  const csvString = csvRows.map((r) => r.join(",")).join("\n");

  return (
    <>
      <PageHeader
        title="Financial Reports"
        description={`Profit & Loss — ${now.getFullYear()}`}
        actions={<ExportCSV csv={csvString} filename={`PnL-${now.getFullYear()}.csv`} />}
      />

      {/* YTD Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">YTD Income</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(ytdIncome)}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">YTD Expenses</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(ytdExpenses)}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Net Profit</p>
          <p className={`text-xl font-bold ${ytdNet >= 0 ? "text-teal" : "text-red-400"}`}>
            {ytdNet < 0 ? "-" : ""}{formatCurrency(Math.abs(ytdNet))}
          </p>
        </div>
      </div>

      {/* Monthly P&L Table */}
      <div className="glass-card overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-background">Category</th>
                {sortedMonths.map((m) => (
                  <th key={m} className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{getMonthLabel(m)}</th>
                ))}
                <th className="text-right px-5 py-3 text-xs font-medium text-teal uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Income section */}
              <tr className="border-b border-border bg-teal-subtle/30">
                <td colSpan={sortedMonths.length + 2} className="px-5 py-2 text-xs font-bold text-green-400 uppercase tracking-widest">Revenue</td>
              </tr>
              {Object.entries(incomeByCategory).map(([cat, vals]) => {
                const total = Object.values(vals).reduce((s, v) => s + v, 0);
                return (
                  <tr key={`inc-${cat}`} className="border-b border-border/50 hover:bg-card">
                    <td className="px-5 py-2.5 text-sm text-gray-300 sticky left-0 bg-background">{incomeCategoryLabels[cat] || cat}</td>
                    {sortedMonths.map((m) => (
                      <td key={m} className="px-4 py-2.5 text-sm text-gray-400 text-right font-mono">{vals[m] ? formatCurrency(vals[m]) : "—"}</td>
                    ))}
                    <td className="px-5 py-2.5 text-sm text-foreground text-right font-mono font-medium">{formatCurrency(total)}</td>
                  </tr>
                );
              })}
              <tr className="border-b border-border">
                <td className="px-5 py-2.5 text-sm font-semibold text-green-400 sticky left-0 bg-background">Total Income</td>
                {sortedMonths.map((m) => (
                  <td key={m} className="px-4 py-2.5 text-sm text-green-400 text-right font-mono font-semibold">{formatCurrency(monthlyIncome[m] || 0)}</td>
                ))}
                <td className="px-5 py-2.5 text-sm text-green-400 text-right font-mono font-bold">{formatCurrency(ytdIncome)}</td>
              </tr>

              {/* Expense section */}
              <tr className="border-b border-border bg-danger-subtle/30">
                <td colSpan={sortedMonths.length + 2} className="px-5 py-2 text-xs font-bold text-red-400 uppercase tracking-widest">Expenses</td>
              </tr>
              {Object.entries(expenseByCategory).map(([cat, vals]) => {
                const total = Object.values(vals).reduce((s, v) => s + v, 0);
                return (
                  <tr key={`exp-${cat}`} className="border-b border-border/50 hover:bg-card">
                    <td className="px-5 py-2.5 text-sm text-gray-300 sticky left-0 bg-background">{expenseCategoryLabels[cat] || cat}</td>
                    {sortedMonths.map((m) => (
                      <td key={m} className="px-4 py-2.5 text-sm text-gray-400 text-right font-mono">{vals[m] ? formatCurrency(vals[m]) : "—"}</td>
                    ))}
                    <td className="px-5 py-2.5 text-sm text-foreground text-right font-mono font-medium">{formatCurrency(total)}</td>
                  </tr>
                );
              })}
              <tr className="border-b border-border">
                <td className="px-5 py-2.5 text-sm font-semibold text-red-400 sticky left-0 bg-background">Total Expenses</td>
                {sortedMonths.map((m) => (
                  <td key={m} className="px-4 py-2.5 text-sm text-red-400 text-right font-mono font-semibold">{formatCurrency(monthlyExpenses[m] || 0)}</td>
                ))}
                <td className="px-5 py-2.5 text-sm text-red-400 text-right font-mono font-bold">{formatCurrency(ytdExpenses)}</td>
              </tr>

              {/* Net row */}
              <tr className="border-t-2 border-teal/30">
                <td className="px-5 py-3 text-sm font-bold text-foreground sticky left-0 bg-background">Net Profit / Loss</td>
                {sortedMonths.map((m) => {
                  const net = (monthlyIncome[m] || 0) - (monthlyExpenses[m] || 0);
                  return (
                    <td key={m} className={`px-4 py-3 text-sm text-right font-mono font-bold ${net >= 0 ? "text-teal" : "text-red-400"}`}>
                      {net < 0 ? "-" : ""}{formatCurrency(Math.abs(net))}
                    </td>
                  );
                })}
                <td className={`px-5 py-3 text-sm text-right font-mono font-bold ${ytdNet >= 0 ? "text-teal" : "text-red-400"}`}>
                  {ytdNet < 0 ? "-" : ""}{formatCurrency(Math.abs(ytdNet))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
