import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
        actions={null}
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Logged</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(!documents || documents.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-card transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-foreground">{doc.name}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 capitalize">{doc.type.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {(doc as Record<string, unknown> & { clients: { id: string; name: string } | null }).clients ? (
                        <Link
                          href={`/clients/${(doc as Record<string, unknown> & { clients: { id: string; name: string } }).clients.id}`}
                          className="hover:text-teal transition-colors"
                        >
                          {(doc as Record<string, unknown> & { clients: { id: string; name: string } }).clients.name}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(doc.created_at)}</td>
                    <td className="px-5 py-3">
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-teal hover:underline"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
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
