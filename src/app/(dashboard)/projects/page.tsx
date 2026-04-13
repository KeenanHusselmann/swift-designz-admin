import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  if (error) console.error("Projects fetch error:", error.message);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track all active and completed projects"
        actions={
          <Link
            href="/projects/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            New Project
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quoted</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!projects || projects.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No projects yet.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/projects/${project.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0]">
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {(project as Record<string, unknown> & { clients: { name: string } | null }).clients?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{project.service || "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={project.status} /></td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {project.quoted_amount ? formatCurrency(project.quoted_amount) : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {project.due_date ? formatDate(project.due_date) : "—"}
                    </td>
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
