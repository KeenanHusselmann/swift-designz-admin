import {
  ChevronRight,
  Briefcase,
  FileText,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import RevenueChart, { type RevenueDataPoint } from "@/components/dashboard/RevenueChart";
import LeadPipelineChart, { type LeadStatusDataPoint } from "@/components/dashboard/LeadPipelineChart";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch KPI data in parallel
  const now = new Date();
  const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const yearStart = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1).toISOString();

  const [
    { count: newLeadsCount },
    { count: activeProjectsCount },
    { data: unpaidInvoices },
    { data: recentLeads },
    { data: recentPayments },
    { data: mtdPayments },
    { data: incomeEntries },
    { data: expenseEntries },
    { data: allLeads },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress"),
    supabase
      .from("invoices")
      .select("amount, paid_amount")
      .in("status", ["sent", "partial", "overdue"]),
    supabase
      .from("leads")
      .select("id, name, email, service, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("payments")
      .select("id, amount, method, paid_at, invoice_id")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("payments")
      .select("amount")
      .gte("paid_at", mtdStart),
    supabase
      .from("income_entries")
      .select("amount, date")
      .gte("date", yearStart),
    supabase
      .from("expenses")
      .select("amount, date")
      .gte("date", yearStart),
    supabase
      .from("leads")
      .select("status"),
  ]);

  const outstandingAmount = (unpaidInvoices || []).reduce(
    (sum, inv) => sum + (inv.amount - inv.paid_amount),
    0
  );

  // Build 12-month revenue trend
  const monthMap = new Map<string, { income: number; expenses: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
    monthMap.set(key, { income: 0, expenses: 0 });
    // store label keyed by key for later
    void label;
  }
  // rebuild with labels
  const orderedMonths: { key: string; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
    orderedMonths.push({ key, label });
  }
  const revenueMap = new Map<string, { income: number; expenses: number }>(
    orderedMonths.map(({ key }) => [key, { income: 0, expenses: 0 }])
  );
  (incomeEntries || []).forEach((e: { amount: number; date: string }) => {
    const key = e.date.slice(0, 7);
    const entry = revenueMap.get(key);
    if (entry) entry.income += e.amount;
  });
  (expenseEntries || []).forEach((e: { amount: number; date: string }) => {
    const key = e.date.slice(0, 7);
    const entry = revenueMap.get(key);
    if (entry) entry.expenses += e.amount;
  });
  const revenueData: RevenueDataPoint[] = orderedMonths.map(({ key, label }) => ({
    month: label,
    income: revenueMap.get(key)?.income ?? 0,
    expenses: revenueMap.get(key)?.expenses ?? 0,
  }));

  // Build lead pipeline counts
  const PIPELINE_ORDER = ["new", "contacted", "qualified", "proposal", "won", "lost"];
  const leadCountMap = new Map<string, number>();
  (allLeads || []).forEach((l: { status: string }) => {
    leadCountMap.set(l.status, (leadCountMap.get(l.status) ?? 0) + 1);
  });
  const pipelineData: LeadStatusDataPoint[] = PIPELINE_ORDER
    .filter((s) => leadCountMap.has(s))
    .map((s) => ({ status: s, count: leadCountMap.get(s)! }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your business at a glance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="New Leads"
          value={String(newLeadsCount ?? 0)}
          subtitle="Awaiting response"
          icon={ChevronRight}
        />
        <KpiCard
          title="Active Projects"
          value={String(activeProjectsCount ?? 0)}
          subtitle="In progress"
          icon={Briefcase}
        />
        <KpiCard
          title="Outstanding"
          value={formatCurrency(outstandingAmount)}
          subtitle="Unpaid invoices"
          icon={FileText}
        />
        <KpiCard
          title="Revenue (MTD)"
          value={formatCurrency(
            (mtdPayments || []).reduce((s, p) => s + p.amount, 0)
          )}
          subtitle="Month to date"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-teal" />
              Recent Leads
            </h2>
            <Link
              href="/leads"
              className="text-xs text-teal hover:underline"
            >
              View all
            </Link>
          </div>
          {(recentLeads?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No leads yet. They will appear here when quote or contact forms are
              submitted.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLeads!.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-card transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lead.service || lead.email}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal" />
              Recent Payments
            </h2>
            <Link
              href="/invoices"
              className="text-xs text-teal hover:underline"
            >
              View all
            </Link>
          </div>
          {(recentPayments?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No payments recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentPayments!.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2 px-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.method.toUpperCase()} &mdash;{" "}
                      {formatDate(payment.paid_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-2">
          <LeadPipelineChart data={pipelineData} />
        </div>
      </div>
    </>
  );
}
