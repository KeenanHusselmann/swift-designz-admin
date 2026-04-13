import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Documents"
        description="Client contracts, proposals, and files"
        actions={
          <Link
            href="/documents/upload"
            className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Upload Document
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {(!documents || documents.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-white hover:text-[#30B0B0]">
                        {doc.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 capitalize">{doc.type.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {(doc as Record<string, unknown> & { clients: { name: string } | null }).clients?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(doc.created_at)}</td>
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
