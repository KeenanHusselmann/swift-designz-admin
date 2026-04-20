"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { IncomeCategory, IncomeSource } from "@/types/database";

export async function createIncomeAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const description = (formData.get("description") as string)?.trim();
  if (!description) return { error: "Description is required." };

  const amountRaw = (formData.get("amount") as string)?.trim();
  if (!amountRaw) return { error: "Amount is required." };
  const parsed = parseFloat(amountRaw);
  if (isNaN(parsed) || parsed <= 0) return { error: "Amount must be a positive number." };
  const amount = Math.round(parsed * 100);

  const date = formData.get("date") as string;
  if (!date) return { error: "Date is required." };

  const category = formData.get("category") as IncomeCategory;
  if (!category) return { error: "Category is required." };

  const source = (formData.get("source") as IncomeSource) || "manual";
  const invoiceId = (formData.get("invoice_id") as string) || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase.from("income_entries").insert({
    source,
    invoice_id: invoiceId,
    description,
    amount,
    date,
    category,
    notes,
  });

  if (error) return { error: error.message };

  revalidatePath("/accounting/income");
  revalidatePath("/accounting");
  redirect("/accounting/income");
}

export async function updateIncomeAction(id: string, formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const description = (formData.get("description") as string)?.trim();
  if (!description) return { error: "Description is required." };

  const amountRaw = (formData.get("amount") as string)?.trim();
  if (!amountRaw) return { error: "Amount is required." };
  const parsed = parseFloat(amountRaw);
  if (isNaN(parsed) || parsed <= 0) return { error: "Amount must be a positive number." };
  const amount = Math.round(parsed * 100);

  const date = formData.get("date") as string;
  if (!date) return { error: "Date is required." };

  const category = formData.get("category") as IncomeCategory;
  if (!category) return { error: "Category is required." };

  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("income_entries")
    .update({ description, amount, date, category, notes })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/accounting/income");
  revalidatePath("/accounting");
  redirect("/accounting/income");
}

export async function deleteIncomeAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("income_entries").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/accounting/income");
  revalidatePath("/accounting");
  redirect("/accounting/income");
}

export async function toggleReconcileAction(id: string, reconciled: boolean) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("income_entries")
    .update({
      reconciled,
      reconciled_at: reconciled ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/accounting/income");
}
