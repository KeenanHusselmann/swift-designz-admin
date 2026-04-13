import PageHeader from "@/components/ui/PageHeader";
import { Users, Bot } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team" description="Manage employees and AI agents" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/team/employees" className="glass-card p-8 text-center hover:border-[#30B0B0]/30 transition-colors">
          <Users className="h-10 w-10 text-[#30B0B0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">Employees</h3>
          <p className="text-sm text-gray-500 mt-2">Manage staff, roles, and salaries</p>
        </Link>

        <Link href="/team/agents" className="glass-card p-8 text-center hover:border-[#30B0B0]/30 transition-colors">
          <Bot className="h-10 w-10 text-[#30B0B0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">AI Agents</h3>
          <p className="text-sm text-gray-500 mt-2">Track your AI assistants and their costs</p>
        </Link>
      </div>
    </>
  );
}
