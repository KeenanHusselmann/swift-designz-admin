import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const ALLOWED_TEMPLATES = [
  "quote-template",
  "invoice-template",
  "nda",
  "client-onboarding",
  "change-request-form",
  "proceed-to-build",
  "maintenance-retainer",
  "payment-plan-agreement",
  "project-handover",
  "terms-and-conditions",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientId: string; template: string }> }
) {
  const { clientId, template } = await params;

  // Validate template name to prevent path traversal
  if (!ALLOWED_TEMPLATES.includes(template)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, phone, company, location")
    .eq("id", clientId)
    .single();

  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const templatePath = path.join(process.cwd(), "public", "docs", `${template}.html`);

  if (!fs.existsSync(templatePath)) {
    return new NextResponse("Template not found", { status: 404 });
  }

  let html = fs.readFileSync(templatePath, "utf-8");

  // Fix relative asset paths
  html = html.replace(/href="shared\.css"/g, 'href="/docs/shared.css"');
  html = html.replace(/src="\.\.\/images\/logo\.png"/g, 'src="/images/logo.png"');

  // Substitute client fields (contenteditable placeholders)
  const name = escapeHtml(client.name || "");
  const email = escapeHtml(client.email || "");
  const phone = escapeHtml(client.phone || "");
  const company = escapeHtml(client.company || "");
  const location = escapeHtml(client.location || "");

  // Date substitution — today's date formatted
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  html = html
    .replace(/>Client Full Name</g, `>${name}<`)
    .replace(/>Company \/ Organisation \(if applicable\)</g, company ? `>${company}<` : `><`)
    .replace(/>client@email\.com</g, `>${email}<`)
    .replace(/>\+___ ___ ___ ____</g, phone ? `>${phone}<` : `><`)
    .replace(/>City, Country</g, location ? `>${location}<` : `><`);

  // Inject today's date into the first date placeholder visible in the document
  html = html.replace(
    /____ \/ ____ \/ ______/,
    dateStr
  );

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
