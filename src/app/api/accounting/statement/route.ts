import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import AccountantStatementPDF from "@/components/statements/AccountantStatementPDF";
import type { IncomeEntry, Expense } from "@/types/database";
import type { CategoryBreakdown, LedgerEntry } from "@/components/statements/AccountantStatementPDF";

const INCOME_LABELS: Record<string, string> = {
  web_dev: "Web Development",
  ecommerce: "E-Commerce",
  apps: "Apps",
  training: "Training",
  consulting: "Consulting",
  investment: "Investment",
  other: "Other",
};

const EXPENSE_LABELS: Record<string, string> = {
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

function formatCatLabel(cat: string, map: Record<string, string>): string {
  return map[cat] || cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupByCategory(
  entries: { category: string; amount: number }[],
  labelMap: Record<string, string>
): CategoryBreakdown[] {
  const map = new Map<string, { count: number; total: number }>();
  for (const e of entries) {
    const existing = map.get(e.category) ?? { count: 0, total: 0 };
    map.set(e.category, { count: existing.count + 1, total: existing.total + e.amount });
  }
  return Array.from(map.entries())
    .map(([category, { count, total }]) => ({
      category,
      label: formatCatLabel(category, labelMap),
      count,
      total,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  const [year, mon] = month.split("-").map(Number);
  const startDate = `${year}-${String(mon).padStart(2, "0")}-01`;
  const endDate = new Date(year, mon, 0).toISOString().split("T")[0];

  const [{ data: incomeRaw }, { data: expensesRaw }] = await Promise.all([
    supabase
      .from("income_entries")
      .select("date, description, category, amount")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date"),
    supabase
      .from("expenses")
      .select("date, description, category, amount")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date"),
  ]);

  const incomeEntries = (incomeRaw || []) as Pick<IncomeEntry, "date" | "description" | "category" | "amount">[];
  const expenseEntries = (expensesRaw || []) as Pick<Expense, "date" | "description" | "category" | "amount">[];

  const totalIncome = incomeEntries.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenseEntries.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const incomeByCategory = groupByCategory(incomeEntries, INCOME_LABELS);
  const expenseByCategory = groupByCategory(expenseEntries, EXPENSE_LABELS);

  const incomeLedger: LedgerEntry[] = incomeEntries.map((e) => ({
    date: e.date,
    description: e.description,
    categoryLabel: formatCatLabel(e.category, INCOME_LABELS),
    amount: e.amount,
  }));

  const expenseLedger: LedgerEntry[] = expenseEntries.map((e) => ({
    date: e.date,
    description: e.description,
    categoryLabel: formatCatLabel(e.category, EXPENSE_LABELS),
    amount: e.amount,
  }));

  const monthLabel = new Date(year, mon - 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
  const generatedAt = new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

  const buffer = await renderToBuffer(
    AccountantStatementPDF({
      monthLabel,
      totalIncome,
      totalExpenses,
      netProfit,
      incomeByCategory,
      expenseByCategory,
      incomeLedger,
      expenseLedger,
      generatedAt,
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Financial-Statement-${month}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
