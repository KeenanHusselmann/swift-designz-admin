import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Clients fetch error:", error.message);

  return (
    <>
      <PageHeader
        title="Clients"
        description="Your client directory"
        actions={
          <Link
            href="/clients/new"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Client
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!clients || clients.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                    No clients yet. Convert a lead or add one manually.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/clients/${client.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0]">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{client.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{client.company || "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{client.phone || "—"}</td>
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
