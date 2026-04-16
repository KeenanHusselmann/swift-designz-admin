import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import TemplatePDF from "@/components/documents/TemplatePDF";
import { getTemplateContent } from "@/lib/document-content-registry";
import { getDocumentTemplatesForRole } from "@/lib/document-templates";
import type { UserRole } from "@/types/database";
import fs from "fs";
import path from "path";

function loadLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "favicon.png");
    const buf = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  /* ── Auth ──────────────────────────────── */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "viewer") as UserRole;

  /* ── Access check ─────────────────────── */
  const allowed = getDocumentTemplatesForRole(role);
  const template = allowed.find((t) => t.slug === slug);
  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* ── Content lookup ───────────────────── */
  const doc = getTemplateContent(slug);
  if (!doc) {
    return NextResponse.json({ error: "PDF not available for this template" }, { status: 404 });
  }

  /* ── Render PDF ───────────────────────── */
  const logoSrc = loadLogoBase64();
  const buffer = await renderToBuffer(
    TemplatePDF({ doc, logoSrc }),
  );

  const filename = `${template.label.replace(/\s+/g, "-")}-${doc.ref}`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
