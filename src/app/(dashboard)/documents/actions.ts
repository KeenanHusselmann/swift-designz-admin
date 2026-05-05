"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sendDocumentEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

const TEMPLATE_LABELS: Record<string, string> = {
  "quote-template": "Quotation",
  "invoice-template": "Invoice",
  "nda": "NDA",
  "client-onboarding": "Onboarding Guide",
  "change-request-form": "Change Request",
  "proceed-to-build": "Proceed to Build",
  "maintenance-retainer": "Maintenance Retainer",
  "payment-plan-agreement": "Payment Plan Agreement",
  "project-handover": "Project Handover",
  "terms-and-conditions": "Terms & Conditions",
};

export async function sendDocumentAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const clientId = formData.get("client_id") as string;
  const template = formData.get("template") as string;
  const recipientEmail = (formData.get("recipient_email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string | null)?.trim() || "";

  if (!clientId || !template || !recipientEmail || !subject) {
    return { error: "Missing required fields." };
  }

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email")
    .eq("id", clientId)
    .single();

  if (!client) return { error: "Client not found." };

  const templateLabel = TEMPLATE_LABELS[template] ?? template;
  const docUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://admin.swiftdesignz.co.za"}/api/docs/${clientId}/${template}`;

  const { error: sendError } = await sendDocumentEmail({
    to: recipientEmail,
    clientName: client.name,
    subject,
    message,
    templateLabel,
    docUrl,
  });

  if (sendError) {
    return { error: `Failed to send email: ${sendError.message}` };
  }

  // Log the document record
  const { data: profile } = await supabase.auth.getUser();
  if (profile?.user) {
    await supabase.from("documents").insert({
      client_id: clientId,
      name: `${templateLabel} — ${client.name}`,
      type: "other",
      file_url: docUrl,
      file_size: 0,
      uploaded_by: profile.user.id,
    });
  }

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/documents");

  return { success: true };
}

export async function acknowledgeSopAction(sopId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("sop_acknowledgements")
    .upsert({ sop_id: sopId, user_id: user.id }, { onConflict: "sop_id,user_id" });

  if (error) return { error: error.message };

  revalidatePath("/documents");
  revalidatePath("/documents/[category]", "page");

  return { success: true };
}

