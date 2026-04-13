import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Leads"
        description="Quote requests and contact form submissions"
        actions={
          <Link
            href="/leads/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Lead
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!leads || leads.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                    No leads yet. They will appear here when your website forms receive submissions.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/leads/${lead.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0]">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{lead.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{lead.service || "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(lead.created_at)}</td>
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
