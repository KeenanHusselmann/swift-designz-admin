"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EquipmentCategory, EquipmentCondition, EquipmentStatus } from "@/types/database";

export async function createEquipmentAction(formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const category = (formData.get("category") as EquipmentCategory)?.trim();
  if (!category) return { error: "Category is required." };

  const serial_number = (formData.get("serial_number") as string)?.trim() || null;
  const purchased_at = (formData.get("purchased_at") as string)?.trim() || null;

  const purchasePriceRaw = (formData.get("purchase_price") as string)?.trim();
  const parsedPurchase = purchasePriceRaw ? parseFloat(purchasePriceRaw) : 0;
  if (isNaN(parsedPurchase) || parsedPurchase < 0) return { error: "Purchase price must be a valid number." };
  const purchase_price = Math.round(parsedPurchase * 100);

  const currentValueRaw = (formData.get("current_value") as string)?.trim();
  const parsedCurrent = currentValueRaw ? parseFloat(currentValueRaw) : 0;
  if (isNaN(parsedCurrent) || parsedCurrent < 0) return { error: "Current value must be a valid number." };
  const current_value = Math.round(parsedCurrent * 100);

  const condition = (formData.get("condition") as EquipmentCondition) || "good";
  const status = (formData.get("status") as EquipmentStatus) || "active";
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase.from("equipment").insert({
    name,
    category,
    serial_number,
    purchased_at,
    purchase_price,
    current_value,
    condition,
    status,
    notes,
  });

  if (error) return { error: error.message };

  revalidatePath("/equipment");
  redirect("/equipment");
}

export async function updateEquipmentAction(id: string, formData: FormData) {
  await requireAuth();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const category = (formData.get("category") as EquipmentCategory)?.trim();
  if (!category) return { error: "Category is required." };

  const serial_number = (formData.get("serial_number") as string)?.trim() || null;
  const purchased_at = (formData.get("purchased_at") as string)?.trim() || null;

  const purchasePriceRaw = (formData.get("purchase_price") as string)?.trim();
  const parsedPurchase = purchasePriceRaw ? parseFloat(purchasePriceRaw) : 0;
  if (isNaN(parsedPurchase) || parsedPurchase < 0) return { error: "Purchase price must be a valid number." };
  const purchase_price = Math.round(parsedPurchase * 100);

  const currentValueRaw = (formData.get("current_value") as string)?.trim();
  const parsedCurrent = currentValueRaw ? parseFloat(currentValueRaw) : 0;
  if (isNaN(parsedCurrent) || parsedCurrent < 0) return { error: "Current value must be a valid number." };
  const current_value = Math.round(parsedCurrent * 100);

  const condition = (formData.get("condition") as EquipmentCondition) || "good";
  const status = (formData.get("status") as EquipmentStatus) || "active";
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("equipment")
    .update({ name, category, serial_number, purchased_at, purchase_price, current_value, condition, status, notes })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/equipment");
  redirect("/equipment");
}

export async function deleteEquipmentAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("equipment").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/equipment");
  redirect("/equipment");
}
