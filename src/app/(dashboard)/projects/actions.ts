"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProjectStatus } from "@/types/database";

// ── Create Project (with optional inline client creation) ─────────────────────

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();

  const clientMode = formData.get("client_mode") as string;
  let clientId: string;

  if (clientMode === "new") {
    // Create the client inline first
    const clientName = (formData.get("new_client_name") as string)?.trim();
    const clientEmail = (formData.get("new_client_email") as string)?.trim();
    if (!clientName || !clientEmail) return { error: "Client name and email are required." };

    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: clientName,
        email: clientEmail,
        phone: (formData.get("new_client_phone") as string)?.trim() || null,
        company: (formData.get("new_client_company") as string)?.trim() || null,
      })
      .select("id")
      .single();

    if (clientError) return { error: clientError.message };
    clientId = newClient.id;
    revalidatePath("/clients");
  } else {
    clientId = formData.get("client_id") as string;
    if (!clientId) return { error: "Please select a client." };
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Project name is required." };

  const quotedRaw = (formData.get("quoted_amount") as string)?.trim();
  const quotedAmount = quotedRaw ? Math.round(parseFloat(quotedRaw) * 100) : null;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      client_id: clientId,
      name,
      service: (formData.get("service") as string)?.trim() || null,
      package: (formData.get("package") as string)?.trim() || null,
      status: (formData.get("status") as ProjectStatus) || "planning",
      start_date: (formData.get("start_date") as string) || null,
      due_date: (formData.get("due_date") as string) || null,
      quoted_amount: quotedAmount,
      progress_override: formData.get("progress_override") ? parseInt(formData.get("progress_override") as string, 10) : null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
}

// ── Update Project ────────────────────────────────────────────────────────────

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Project name is required." };

  const quotedRaw = (formData.get("quoted_amount") as string)?.trim();
  const quotedAmount = quotedRaw ? Math.round(parseFloat(quotedRaw) * 100) : null;

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      service: (formData.get("service") as string)?.trim() || null,
      package: (formData.get("package") as string)?.trim() || null,
      status: formData.get("status") as ProjectStatus,
      start_date: (formData.get("start_date") as string) || null,
      due_date: (formData.get("due_date") as string) || null,
      quoted_amount: quotedAmount,
      progress_override: formData.get("progress_override") ? parseInt(formData.get("progress_override") as string, 10) : null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  redirect(`/projects/${id}`);
}

// ── Update Progress Override (inline from detail page) ────────────────────────

export async function updateProgressOverrideAction(projectId: string, value: number | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ progress_override: value })
    .eq("id", projectId);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
}

// ── Delete Project ────────────────────────────────────────────────────────────

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/projects");
  redirect("/projects");
}

// ── Milestones ────────────────────────────────────────────────────────────────

export async function addMilestoneAction(projectId: string, formData: FormData) {
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Milestone title is required." };

  // Get next sort_order
  const { data: existing } = await supabase
    .from("project_milestones")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error } = await supabase.from("project_milestones").insert({
    project_id: projectId,
    title,
    due_date: (formData.get("due_date") as string) || null,
    sort_order: nextOrder,
  });

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
}

export async function toggleMilestoneAction(
  milestoneId: string,
  completed: boolean,
  projectId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_milestones")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", milestoneId);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteMilestoneAction(milestoneId: string, projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_milestones")
    .delete()
    .eq("id", milestoneId);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
}

export async function reorderMilestonesAction(
  milestoneIds: string[],
  projectId: string
) {
  const supabase = await createClient();

  const updates = milestoneIds.map((id, idx) =>
    supabase
      .from("project_milestones")
      .update({ sort_order: idx })
      .eq("id", id)
  );

  await Promise.all(updates);
  revalidatePath(`/projects/${projectId}`);
}
