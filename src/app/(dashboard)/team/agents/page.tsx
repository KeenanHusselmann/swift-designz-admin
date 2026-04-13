import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function AgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("ai_agents")
    .select("*")
    .order("name");

  return (
    <>
      <PageHeader
        title="AI Agents"
        description="Your AI assistants and their configurations"
        actions={
          <Link
            href="/team/agents/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Agent
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/mo</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!agents || agents.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No AI agents registered yet.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-white">{agent.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 max-w-xs truncate">{agent.purpose}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{agent.model}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{agent.provider}</td>
                    <td className="px-5 py-3 text-sm text-white font-medium">{formatCurrency(agent.monthly_cost)}</td>
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
