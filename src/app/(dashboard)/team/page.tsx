import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import InviteUserModal from "@/components/team/InviteUserModal";
import { formatCurrency } from "@/lib/utils";
import { Users, Bot, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function TeamPage() {
  const supabase = await createClient();

  const [employeesResult, agentsResult] = await Promise.all([
    supabase.from("employees").select("status, salary"),
    supabase.from("ai_agents").select("status, monthly_cost"),
  ]);

  const employees = employeesResult.data ?? [];
  const agents = agentsResult.data ?? [];

  const activeEmployees = employees.filter((e) => e.status === "active");
  const activeAgents = agents.filter((a) => a.status === "active");
  const monthlyPayroll = activeEmployees.reduce((s, e) => s + e.salary, 0);
  const monthlyAI = activeAgents.reduce((s, a) => s + a.monthly_cost, 0);
  const totalMonthly = monthlyPayroll + monthlyAI;

  return (
    <>
      <PageHeader
        title="Team"
        description="Manage employees and AI agents"
        actions={<InviteUserModal />}
      />

      {/* Hero */}
      <div className="glass-card p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Total Monthly Overhead
            </p>
            <p className="text-5xl font-bold leading-none text-foreground">{formatCurrency(totalMonthly)}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="text-teal font-medium">{formatCurrency(monthlyPayroll)} payroll</span>
              <span>&mdash;</span>
              <span className="text-blue-400 font-medium">{formatCurrency(monthlyAI)} AI spend</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual Overhead</p>
            <p className="text-4xl font-bold text-teal">{formatCurrency(totalMonthly * 12)}</p>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-5">
          <Users className="h-5 w-5 text-teal mb-3" />
          <p className="text-2xl font-bold text-foreground">{activeEmployees.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active Staff</p>
        </div>
        <div className="glass-card p-5">
          <DollarSign className="h-5 w-5 text-green-400 mb-3" />
          <p className="text-2xl font-bold text-green-400">{formatCurrency(monthlyPayroll)}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly Payroll</p>
        </div>
        <div className="glass-card p-5">
          <Bot className="h-5 w-5 text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-blue-400">{activeAgents.length}</p>
          <p className="text-xs text-gray-500 mt-1">AI Agents</p>
        </div>
        <div className="glass-card p-5">
          <DollarSign className="h-5 w-5 text-purple-400 mb-3" />
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(monthlyAI)}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly AI Spend</p>
        </div>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/team/employees" className="glass-card p-6 hover:border-teal/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-teal/10">
              <Users className="h-6 w-6 text-teal" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-teal transition-colors" />
          </div>
          <h3 className="text-foreground font-semibold mb-1">Employees</h3>
          <p className="text-sm text-gray-500">Manage staff, roles, and salaries</p>
          <div className="flex items-center gap-3 mt-4 text-xs">
            <span className="text-teal font-mono font-medium">{activeEmployees.length} active</span>
            <span className="text-gray-600">&middot;</span>
            <span className="text-gray-400 font-mono">{formatCurrency(monthlyPayroll)}/mo</span>
          </div>
        </Link>

        <Link href="/team/agents" className="glass-card p-6 hover:border-teal/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-blue-400/10">
              <Bot className="h-6 w-6 text-blue-400" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-teal transition-colors" />
          </div>
          <h3 className="text-foreground font-semibold mb-1">AI Agents</h3>
          <p className="text-sm text-gray-500">Track your AI assistants and their costs</p>
          <div className="flex items-center gap-3 mt-4 text-xs">
            <span className="text-blue-400 font-mono font-medium">{activeAgents.length} active</span>
            <span className="text-gray-600">&middot;</span>
            <span className="text-gray-400 font-mono">{formatCurrency(monthlyAI)}/mo</span>
          </div>
        </Link>
      </div>
    </>
  );
}
