"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LiabilityType } from "@/types/database";

export async function createLiabilityAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const type = formData.get("type") as LiabilityType;
  if (!type) return { error: "Type is required." };

  const totalRaw = parseFloat((formData.get("total_amount") as string) || "0");
  const outstandingRaw = parseFloat((formData.get("outstanding") as string) || "0");
  if (isNaN(totalRaw) || totalRaw < 0) return { error: "Total amount must be a positive number." };
  if (isNaN(outstandingRaw) || outstandingRaw < 0) return { error: "Outstanding must be a positive number." };

  const interestRaw = (formData.get("interest_rate") as string)?.trim();
  const interest_rate = interestRaw ? parseFloat(interestRaw) : null;

  const { error } = await supabase.from("liabilities").insert({
    name,
    type,
    lender: (formData.get("lender") as string)?.trim() || null,
    total_amount: Math.round(totalRaw * 100),
    outstanding: Math.round(outstandingRaw * 100),
    interest_rate: interest_rate ?? null,
    due_date: (formData.get("due_date") as string) || null,
    notes: (formData.get("notes") as string)?.trim() || null,
    status: "active",
  });

  if (error) return { error: error.message };

  revalidatePath("/accounting/liabilities");
  revalidatePath("/accounting");
  redirect("/accounting/liabilities");
}

export async function updateLiabilityAction(id: string, formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const type = formData.get("type") as LiabilityType;
  const totalRaw = parseFloat((formData.get("total_amount") as string) || "0");
  const outstandingRaw = parseFloat((formData.get("outstanding") as string) || "0");
  const interestRaw = (formData.get("interest_rate") as string)?.trim();

  const { error } = await supabase
    .from("liabilities")
    .update({
      name,
      type,
      lender: (formData.get("lender") as string)?.trim() || null,
      total_amount: Math.round(totalRaw * 100),
      outstanding: Math.round(outstandingRaw * 100),
      interest_rate: interestRaw ? parseFloat(interestRaw) : null,
      due_date: (formData.get("due_date") as string) || null,
      notes: (formData.get("notes") as string)?.trim() || null,
      status: (formData.get("status") as string) || "active",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/accounting/liabilities");
  revalidatePath("/accounting");
  redirect("/accounting/liabilities");
}

export async function deleteLiabilityAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("liabilities").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/accounting/liabilities");
  revalidatePath("/accounting");
  redirect("/accounting/liabilities");
}
