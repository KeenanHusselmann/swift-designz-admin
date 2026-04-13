"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LeadSource, LeadStatus } from "@/types/database";

// ── Create Lead ──────────────────────────────────────────────────────────────

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  if (!name || !email) return { error: "Name and email are required." };

  const lead = {
    name,
    email,
    source: (formData.get("source") as LeadSource) || "manual",
    phone: (formData.get("phone") as string)?.trim() || null,
    company: (formData.get("company") as string)?.trim() || null,
    location: (formData.get("location") as string)?.trim() || null,
    service: (formData.get("service") as string)?.trim() || null,
    package: (formData.get("package") as string)?.trim() || null,
    scope: (formData.get("scope") as string)?.trim() || null,
    timeline: (formData.get("timeline") as string)?.trim() || null,
    budget: (formData.get("budget") as string)?.trim() || null,
    message: (formData.get("message") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
  };

  const { error } = await supabase.from("leads").insert(lead);
  if (error) return { error: error.message };

  revalidatePath("/leads");
  redirect("/leads");
}

// ── Update Lead ──────────────────────────────────────────────────────────────

export async function updateLead(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  if (!name || !email) return { error: "Name and email are required." };

  const updates = {
    name,
    email,
    status: (formData.get("status") as LeadStatus) || undefined,
    source: (formData.get("source") as LeadSource) || undefined,
    phone: (formData.get("phone") as string)?.trim() || null,
    company: (formData.get("company") as string)?.trim() || null,
    location: (formData.get("location") as string)?.trim() || null,
    service: (formData.get("service") as string)?.trim() || null,
    package: (formData.get("package") as string)?.trim() || null,
    scope: (formData.get("scope") as string)?.trim() || null,
    timeline: (formData.get("timeline") as string)?.trim() || null,
    budget: (formData.get("budget") as string)?.trim() || null,
    message: (formData.get("message") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
  };

  const { error } = await supabase.from("leads").update(updates).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

// ── Delete Lead ──────────────────────────────────────────────────────────────

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/leads");
  redirect("/leads");
}

// ── Convert Lead → Client ────────────────────────────────────────────────────

export async function convertLeadToClient(leadId: string) {
  const supabase = await createClient();

  // Fetch the lead
  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (fetchError || !lead) return { error: "Lead not found." };
  if (lead.status === "won") return { error: "Lead is already converted." };

  // Check if a client already exists for this lead
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("lead_id", leadId)
    .single();

  if (existingClient) return { error: "A client already exists for this lead." };

  // Create client from lead data
  const { error: insertError } = await supabase.from("clients").insert({
    lead_id: leadId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    location: lead.location,
  });

  if (insertError) return { error: insertError.message };

  // Update lead status to won
  await supabase.from("leads").update({ status: "won" }).eq("id", leadId);

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/clients");
  redirect(`/leads/${leadId}`);
}

// ── Add Note ─────────────────────────────────────────────────────────────────

export async function addLeadNote(leadId: string, formData: FormData) {
  const supabase = await createClient();
  const content = (formData.get("content") as string)?.trim();
  if (!content) return { error: "Note content is required." };

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    content,
    author_id: user?.id ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/leads/${leadId}`);
}

// ── Delete Note ──────────────────────────────────────────────────────────────

export async function deleteLeadNote(noteId: string, leadId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
  if (error) return { error: error.message };
  revalidatePath(`/leads/${leadId}`);
}
