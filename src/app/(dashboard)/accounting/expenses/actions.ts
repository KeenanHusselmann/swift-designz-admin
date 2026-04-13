"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ExpenseCategory, RecurringInterval } from "@/types/database";

export async function createExpenseAction(formData: FormData) {
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

  const category = formData.get("category") as ExpenseCategory;
  if (!category) return { error: "Category is required." };

  const recurring = formData.get("recurring") === "on";
  const recurringInterval = recurring
    ? (formData.get("recurring_interval") as RecurringInterval) || null
    : null;

  const notes = (formData.get("notes") as string)?.trim() || null;

  // Receipt upload
  let receiptUrl: string | null = null;
  const receiptFile = formData.get("receipt") as File | null;
  if (receiptFile && receiptFile.size > 0) {
    const ext = (receiptFile.name.split(".").pop() || "").toLowerCase();
    const allowed = ["pdf", "png", "jpg", "jpeg", "webp"];
    if (!allowed.includes(ext)) return { error: "Only PDF, PNG, JPG, and WebP files are allowed." };

    const filePath = `expenses/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, receiptFile);
    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);
    receiptUrl = urlData.publicUrl;
  }

  const { error } = await supabase.from("expenses").insert({
    category,
    description,
    amount,
    date,
    recurring,
    recurring_interval: recurringInterval,
    receipt_url: receiptUrl,
    notes,
  });

  if (error) return { error: error.message };

  revalidatePath("/accounting/expenses");
  revalidatePath("/accounting");
  redirect("/accounting/expenses");
}

export async function updateExpenseAction(id: string, formData: FormData) {
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

  const category = formData.get("category") as ExpenseCategory;
  if (!category) return { error: "Category is required." };

  const recurring = formData.get("recurring") === "on";
  const recurringInterval = recurring
    ? (formData.get("recurring_interval") as RecurringInterval) || null
    : null;

  const notes = (formData.get("notes") as string)?.trim() || null;

  // Handle new receipt upload (keep existing if no new file)
  let receiptUrl: string | null | undefined = undefined;
  const receiptFile = formData.get("receipt") as File | null;
  if (receiptFile && receiptFile.size > 0) {
    const ext = (receiptFile.name.split(".").pop() || "").toLowerCase();
    const allowed = ["pdf", "png", "jpg", "jpeg", "webp"];
    if (!allowed.includes(ext)) return { error: "Only PDF, PNG, JPG, and WebP files are allowed." };

    const filePath = `expenses/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, receiptFile);
    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);
    receiptUrl = urlData.publicUrl;
  }

  const updateData: Record<string, unknown> = {
    category,
    description,
    amount,
    date,
    recurring,
    recurring_interval: recurringInterval,
    notes,
  };
  if (receiptUrl !== undefined) updateData.receipt_url = receiptUrl;

  const { error } = await supabase.from("expenses").update(updateData).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/accounting/expenses");
  revalidatePath("/accounting");
  redirect("/accounting/expenses");
}

export async function deleteExpenseAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/accounting/expenses");
  revalidatePath("/accounting");
  redirect("/accounting/expenses");
}
