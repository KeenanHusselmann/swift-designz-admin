import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink, Eye, FileText, BookOpen, Users, Lock } from "lucide-react";
import { getDocumentTemplatesForRole } from "@/lib/document-templates";
import type { Document, DocumentType, UserRole } from "@/types/database";

const typeConfig: Record<DocumentType, { label: string; color: string; bg: string }> = {
  contract:  { label: "Contract",  color: "text-blue-400",   bg: "bg-blue-400/10" },
  proposal:  { label: "Proposal",  color: "text-purple-400", bg: "bg-purple-400/10" },
  invoice:   { label: "Invoice",   color: "text-green-400",  bg: "bg-green-400/10" },
  receipt:   { label: "Receipt",   color: "text-teal",       bg: "bg-teal/10" },
  agreement: { label: "Agreement", color: "text-amber-400",  bg: "bg-amber-400/10" },
  report:    { label: "Report",    color: "text-orange-400", bg: "bg-orange-400/10" },
  other:     { label: "Other",     color: "text-gray-400",   bg: "bg-gray-500/10" },
};

type DocWithClient = Document & { clients: { id: string; name: string } | null };

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: authUser } = await supabase.auth.getUser();

  const userId = authUser.user?.id;
  const { data: profile } = userId
    ? await supabase.from("profiles").select("role").eq("id", userId).single()
    : { data: null };
  const role = (profile?.role as UserRole | undefined) ?? null;
  const canOpenClient = role !== "investor";
  const libraryDocs = getDocumentTemplatesForRole(role);

  let investorId: string | null = null;
  if (role === "investor" && authUser.user?.email) {
    const { data } = await supabase
      .from("investors")
      .select("id")
      .eq("email", authUser.user.email.toLowerCase())
      .maybeSingle();
    investorId = data?.id ?? null;
  }

  let documentsQuery = supabase
    .from("documents")
    .select("*, clients(id, name)")
    .order("created_at", { ascending: false });

  if (role === "investor") {
    documentsQuery = investorId
      ? documentsQuery.eq("investor_id", investorId)
      : documentsQuery.eq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { data: documentsRaw } = await documentsQuery;
  const documents = (documentsRaw ?? []) as DocWithClient[];

  // ── Stats ───────────────────────────────────────────────────
  const loggedTotal = documents.length;
  const clientDocs = documents.filter((d) => d.client_id !== null && d.investor_id === null).length;
  const investorDocs = documents.filter((d) => d.investor_id !== null).length;

  const typeCounts = documents.reduce<Partial<Record<DocumentType, number>>>((acc, d) => {
    acc[d.type] = (acc[d.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Documents"
        description="Templates and logged documents"
      />

      {/* Hero */}
      <div className="glass-card p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Document Library
            </p>
            <p className="text-5xl font-bold leading-none text-foreground">{libraryDocs.length}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="text-gray-400 font-medium">templates available</span>
              {loggedTotal > 0 && (
                <>
                  <span>&mdash;</span>
                  <span className="text-teal font-medium">{loggedTotal} logged</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Logged Documents</p>
            <p className="text-4xl font-bold text-teal">{loggedTotal}</p>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-5">
          <BookOpen className="h-5 w-5 text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-foreground">{libraryDocs.length}</p>
          <p className="text-xs text-gray-500 mt-1">Templates</p>
        </div>
        <div className="glass-card p-5">
          <FileText className="h-5 w-5 text-teal mb-3" />
          <p className="text-2xl font-bold text-teal">{loggedTotal}</p>
          <p className="text-xs text-gray-500 mt-1">Logged Docs</p>
        </div>
        <div className="glass-card p-5">
          <Users className="h-5 w-5 text-amber-400 mb-3" />
          <p className="text-2xl font-bold text-amber-400">{clientDocs}</p>
          <p className="text-xs text-gray-500 mt-1">Client Docs</p>
        </div>
        <div className="glass-card p-5">
          <Lock className="h-5 w-5 text-purple-400 mb-3" />
          <p className="text-2xl font-bold text-purple-400">{investorDocs}</p>
          <p className="text-xs text-gray-500 mt-1">Investor Docs</p>
        </div>
      </div>

      {/* Type breakdown pills */}
      {loggedTotal > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.entries(typeCounts) as [DocumentType, number][])
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => {
              const cfg = typeConfig[type];
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}
                >
                  {count} {cfg.label}
                </span>
              );
            })}
        </div>
      )}

      {/* Template library */}
      <div className="glass-card p-5 mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Available Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {libraryDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/documents/view/${doc.slug}`}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-teal text-sm text-gray-300 hover:text-teal transition-colors"
            >
              <Eye className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
              {doc.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Logged documents table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Logged</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-500">
                    No documents logged yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc, i) => {
                  const cfg = typeConfig[doc.type] ?? typeConfig.other;
                  return (
                    <tr
                      key={doc.id}
                      className={`border-b border-border/50 hover:bg-card transition-colors ${
                        i % 2 === 1 ? "bg-card/20" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-foreground">{doc.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {doc.clients ? (
                          canOpenClient ? (
                            <Link
                              href={`/clients/${doc.clients.id}`}
                              className="hover:text-teal transition-colors"
                            >
                              {doc.clients.name}
                            </Link>
                          ) : (
                            <span>{doc.clients.name}</span>
                          )
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right whitespace-nowrap">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {doc.file_url ? (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-teal hover:underline"
                          >
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
