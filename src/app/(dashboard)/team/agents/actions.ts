"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AgentStatus } from "@/types/database";

export async function createAgentAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const purpose = (formData.get("purpose") as string)?.trim();
  if (!purpose) return { error: "Purpose is required." };

  const model = (formData.get("model") as string)?.trim();
  if (!model) return { error: "Model is required." };

  const provider = (formData.get("provider") as string)?.trim();
  if (!provider) return { error: "Provider is required." };

  const costRaw = (formData.get("monthly_cost") as string)?.trim();
  const parsed = costRaw ? parseFloat(costRaw) : 0;
  if (isNaN(parsed) || parsed < 0) return { error: "Monthly cost must be a valid number." };
  const monthly_cost = Math.round(parsed * 100);

  const status = (formData.get("status") as AgentStatus) || "active";
  const config_notes = (formData.get("config_notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("ai_agents")
    .insert({ name, purpose, model, provider, monthly_cost, status, config_notes });

  if (error) return { error: error.message };

  revalidatePath("/team/agents");
  redirect("/team/agents");
}

export async function updateAgentAction(id: string, formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const purpose = (formData.get("purpose") as string)?.trim();
  if (!purpose) return { error: "Purpose is required." };

  const model = (formData.get("model") as string)?.trim();
  if (!model) return { error: "Model is required." };

  const provider = (formData.get("provider") as string)?.trim();
  if (!provider) return { error: "Provider is required." };

  const costRaw = (formData.get("monthly_cost") as string)?.trim();
  const parsed = costRaw ? parseFloat(costRaw) : 0;
  if (isNaN(parsed) || parsed < 0) return { error: "Monthly cost must be a valid number." };
  const monthly_cost = Math.round(parsed * 100);

  const status = (formData.get("status") as AgentStatus) || "active";
  const config_notes = (formData.get("config_notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("ai_agents")
    .update({ name, purpose, model, provider, monthly_cost, status, config_notes })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/team/agents");
  revalidatePath(`/team/agents/${id}`);
  redirect(`/team/agents/${id}`);
}

export async function deleteAgentAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("ai_agents").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/team/agents");
  redirect("/team/agents");
}
