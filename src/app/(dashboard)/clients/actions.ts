"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidEmail } from "@/lib/utils";

// ── Create Client ─────────────────────────────────────────────────────────────

export async function createClientAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  if (!name || !email) return { error: "Name and email are required." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name,
      email,
      phone: (formData.get("phone") as string)?.trim() || null,
      company: (formData.get("company") as string)?.trim() || null,
      location: (formData.get("location") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

// ── Update Client ─────────────────────────────────────────────────────────────

export async function updateClientAction(id: string, formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  if (!name || !email) return { error: "Name and email are required." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      email,
      phone: (formData.get("phone") as string)?.trim() || null,
      company: (formData.get("company") as string)?.trim() || null,
      location: (formData.get("location") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
  redirect(`/clients/${id}`);
}

// ── Delete Client ─────────────────────────────────────────────────────────────

export async function deleteClientAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/clients");
  redirect("/clients");
}
