import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDocumentTemplatesForRole } from "@/lib/document-templates";
import { hasTemplateContent } from "@/lib/document-content-registry";
import type { UserRole } from "@/types/database";
import DocumentViewer from "@/components/documents/DocumentViewer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DocumentViewPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as UserRole | undefined) ?? null;
  const allowed = getDocumentTemplatesForRole(role);
  const template = allowed.find((t) => t.slug === slug);

  if (!template) redirect("/documents");

  const hasPdf = hasTemplateContent(slug);

  return <DocumentViewer slug={slug} label={template.label} hasPdf={hasPdf} />;
}
