import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const DOCUMENT_LIBRARY = [
  { slug: "quote-template", label: "Quotation" },
  { slug: "invoice-template", label: "Invoice" },
  { slug: "nda", label: "Client NDA" },
  { slug: "terms-and-conditions", label: "Client Terms and Conditions" },
  { slug: "client-onboarding", label: "Client Onboarding" },
  { slug: "change-request-form", label: "Change Request Form" },
  { slug: "proceed-to-build", label: "Proceed to Build" },
  { slug: "maintenance-retainer", label: "Maintenance Retainer" },
  { slug: "payment-plan-agreement", label: "Payment Plan Agreement" },
  { slug: "project-handover", label: "Project Handover" },
  { slug: "investor-nda", label: "Investor NDA" },
  { slug: "investor-terms-and-conditions", label: "Investor Terms and Conditions" },
];

export default async function DocumentsPage() {
  const supabase = await createClient();
  const [
    { data: documents },
    { data: authUser },
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("*, clients(name)")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const userId = authUser.user?.id;
  const { data: profile } = userId
    ? await supabase.from("profiles").select("role").eq("id", userId).single()
    : { data: null };
  const canOpenClient = profile?.role !== "investor";

  return (
    <>
      <PageHeader
        title="Documents"
        description="Templates and logged documents"
      />

      <div className="glass-card p-5 mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Document Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DOCUMENT_LIBRARY.map((doc) => (
            <a
              key={doc.slug}
              href={`/docs/${doc.slug}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-lg border border-border bg-card hover:border-teal text-sm text-gray-300 hover:text-teal transition-colors"
            >
              {doc.label}
            </a>
          ))}
        </div>
      </div>

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
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
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
                        canOpenClient ? (
                        <Link
                          href={`/clients/${(doc as Record<string, unknown> & { clients: { id: string; name: string } }).clients.id}`}
                          className="hover:text-teal transition-colors"
                        >
                          {(doc as Record<string, unknown> & { clients: { id: string; name: string } }).clients.name}
                        </Link>
                        ) : (
                          <span>{(doc as Record<string, unknown> & { clients: { id: string; name: string } }).clients.name}</span>
                        )
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
