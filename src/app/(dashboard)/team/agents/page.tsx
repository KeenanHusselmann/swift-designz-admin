import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { AiAgent } from "@/types/database";
import { Bot } from "lucide-react";

export default async function AgentsPage() {
  const supabase = await createClient();
  const { data: agentsRaw } = await supabase
    .from("ai_agents")
    .select("*")
    .order("name");

  const agents = (agentsRaw || []) as AiAgent[];
  const activeAgents = agents.filter((a) => a.status === "active");
  const totalMonthlySpend = activeAgents.reduce((s, a) => s + a.monthly_cost, 0);

  return (
    <>
      <PageHeader
        title="AI Agents"
        description="Your AI assistants and their configurations"
        actions={
          <Link
            href="/team/agents/new"
            className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Agent
          </Link>
        }
      />

      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-teal/10">
            <Bot className="h-5 w-5 text-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Agents</p>
            <p className="text-lg font-semibold text-foreground">{activeAgents.length}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-teal/10">
            <Bot className="h-5 w-5 text-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Monthly AI Spend</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(totalMonthlySpend)}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-teal/10">
            <Bot className="h-5 w-5 text-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Annual AI Spend</p>
            <p className="text-lg font-semibold text-teal">{formatCurrency(totalMonthlySpend * 12)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/mo</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No AI agents registered yet.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-card transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/team/agents/${agent.id}`} className="text-sm font-medium text-foreground hover:text-teal">
                        {agent.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 max-w-xs truncate">{agent.purpose}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{agent.model}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{agent.provider}</td>
                    <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(agent.monthly_cost)}</td>
                    <td className="px-5 py-3"><StatusBadge status={agent.status} /></td>
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
