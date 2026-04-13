"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateUploadedFile, secureFileName } from "@/lib/utils";
import type { InvoiceStatus, PaymentMethod } from "@/types/database";

// ── Create Invoice ────────────────────────────────────────────────────────────

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();

  const clientId = formData.get("client_id") as string;
  if (!clientId) return { error: "Client is required." };

  const projectId = (formData.get("project_id") as string) || null;
  const dueDate = formData.get("due_date") as string;
  if (!dueDate) return { error: "Due date is required." };

  const notes = (formData.get("notes") as string)?.trim() || null;
  const status = (formData.get("status") as InvoiceStatus) || "draft";

  // Parse line items from JSON hidden input
  const itemsJson = formData.get("items") as string;
  let items: { description: string; quantity: number; unit_rate: number }[];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid line items data." };
  }

  if (!items || items.length === 0) return { error: "At least one line item is required." };

  // Validate items and compute total
  let total = 0;
  for (const item of items) {
    if (!item.description?.trim()) return { error: "Each item needs a description." };
    if (item.quantity <= 0) return { error: "Quantity must be positive." };
    if (item.unit_rate < 0) return { error: "Rate cannot be negative." };
    total += Math.round(item.quantity * item.unit_rate);
  }

  // Generate invoice number
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  const sequence = (count ?? 0) + 1;
  const year = new Date().getFullYear();
  const invoiceNumber = `INV-${year}-${String(sequence).padStart(3, "0")}`;

  // Insert invoice
  const { data: invoice, error: invError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      client_id: clientId,
      project_id: projectId,
      amount: total,
      status,
      due_date: dueDate,
      notes,
    })
    .select("id")
    .single();

  if (invError) return { error: invError.message };

  // Insert line items
  const itemRows = items.map((item, i) => ({
    invoice_id: invoice.id,
    description: item.description.trim(),
    quantity: item.quantity,
    unit_rate: item.unit_rate,
    amount: Math.round(item.quantity * item.unit_rate),
    sort_order: i,
  }));

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemRows);
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/invoices");
  revalidatePath(`/clients/${clientId}`);
  redirect(`/invoices/${invoice.id}`);
}

// ── Update Invoice ────────────────────────────────────────────────────────────

export async function updateInvoiceAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const clientId = formData.get("client_id") as string;
  if (!clientId) return { error: "Client is required." };

  const projectId = (formData.get("project_id") as string) || null;
  const dueDate = formData.get("due_date") as string;
  if (!dueDate) return { error: "Due date is required." };

  const notes = (formData.get("notes") as string)?.trim() || null;
  const status = (formData.get("status") as InvoiceStatus) || "draft";

  // Parse line items
  const itemsJson = formData.get("items") as string;
  let items: { description: string; quantity: number; unit_rate: number }[];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid line items data." };
  }

  if (!items || items.length === 0) return { error: "At least one line item is required." };

  let total = 0;
  for (const item of items) {
    if (!item.description?.trim()) return { error: "Each item needs a description." };
    if (item.quantity <= 0) return { error: "Quantity must be positive." };
    if (item.unit_rate < 0) return { error: "Rate cannot be negative." };
    total += Math.round(item.quantity * item.unit_rate);
  }

  const { error: invError } = await supabase
    .from("invoices")
    .update({
      client_id: clientId,
      project_id: projectId,
      amount: total,
      status,
      due_date: dueDate,
      notes,
    })
    .eq("id", id);

  if (invError) return { error: invError.message };

  // Replace all line items
  await supabase.from("invoice_items").delete().eq("invoice_id", id);

  const itemRows = items.map((item, i) => ({
    invoice_id: id,
    description: item.description.trim(),
    quantity: item.quantity,
    unit_rate: item.unit_rate,
    amount: Math.round(item.quantity * item.unit_rate),
    sort_order: i,
  }));

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemRows);
  if (itemsError) return { error: itemsError.message };

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  redirect(`/invoices/${id}`);
}

// ── Delete Invoice ────────────────────────────────────────────────────────────

export async function deleteInvoiceAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/invoices");
  redirect("/invoices");
}

// ── Record Payment ────────────────────────────────────────────────────────────

export async function addPaymentAction(formData: FormData) {
  const supabase = await createClient();

  const invoiceId = formData.get("invoice_id") as string;
  if (!invoiceId) return { error: "Invoice is required." };

  const amountRaw = (formData.get("amount") as string)?.trim();
  if (!amountRaw) return { error: "Amount is required." };
  const parsed = parseFloat(amountRaw);
  if (isNaN(parsed) || parsed <= 0) return { error: "Amount must be a positive number." };
  const amount = Math.round(parsed * 100);

  const method = formData.get("method") as PaymentMethod;
  if (!method) return { error: "Payment method is required." };

  const paidAt = formData.get("paid_at") as string;
  if (!paidAt) return { error: "Payment date is required." };

  const reference = (formData.get("reference") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  // Handle proof upload
  let proofUrl: string | null = null;
  const proofFile = formData.get("proof") as File | null;
  if (proofFile && proofFile.size > 0) {
    const fileError = validateUploadedFile(proofFile);
    if (fileError) return { error: fileError };
    const ext = (proofFile.name.split(".").pop() || "").toLowerCase();
    const filePath = `payments/${invoiceId}/${secureFileName(ext)}`;
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, proofFile);
    if (uploadError) return { error: "Upload failed. Please try again." };

    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);
    proofUrl = urlData.publicUrl;
  }

  // Insert payment
  const { error: payError } = await supabase.from("payments").insert({
    invoice_id: invoiceId,
    amount,
    method,
    reference,
    proof_url: proofUrl,
    paid_at: paidAt,
    notes,
  });

  if (payError) return { error: payError.message };

  // Auto-update invoice status
  const { data: invoice } = await supabase
    .from("invoices")
    .select("amount, paid_amount, status, invoice_number, clients(name)")
    .eq("id", invoiceId)
    .single();

  if (invoice) {
    const newPaidAmount = invoice.paid_amount + amount;
    let newStatus: InvoiceStatus = invoice.status;

    if (newPaidAmount >= invoice.amount) {
      newStatus = "paid";
    } else if (newPaidAmount > 0) {
      newStatus = "partial";
    }

    await supabase
      .from("invoices")
      .update({
        paid_amount: newPaidAmount,
        paid_date: newPaidAmount >= invoice.amount ? paidAt : null,
        status: newStatus,
      })
      .eq("id", invoiceId);

    // Auto-create income entry
    const clientRel = invoice.clients as unknown as { name: string } | { name: string }[] | null;
    const clientName = Array.isArray(clientRel) ? clientRel[0]?.name : clientRel?.name || "Client";
    await supabase.from("income_entries").insert({
      source: "invoice" as const,
      invoice_id: invoiceId,
      description: `Payment — ${invoice.invoice_number} (${clientName})`,
      amount,
      date: paidAt,
      category: "web_dev" as const,
    });
  }

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/accounting/income");
  revalidatePath("/accounting");
  return { success: true };
}

// ── Delete Payment ────────────────────────────────────────────────────────────

export async function deletePaymentAction(paymentId: string, invoiceId: string) {
  const supabase = await createClient();

  // Get the payment amount to deduct
  const { data: payment } = await supabase
    .from("payments")
    .select("amount")
    .eq("id", paymentId)
    .single();

  if (!payment) return { error: "Payment not found." };

  const { error } = await supabase.from("payments").delete().eq("id", paymentId);
  if (error) return { error: error.message };

  // Recalculate invoice totals
  const { data: invoice } = await supabase
    .from("invoices")
    .select("amount, paid_amount")
    .eq("id", invoiceId)
    .single();

  if (invoice) {
    const newPaidAmount = Math.max(0, invoice.paid_amount - payment.amount);
    let newStatus: InvoiceStatus;

    if (newPaidAmount >= invoice.amount) {
      newStatus = "paid";
    } else if (newPaidAmount > 0) {
      newStatus = "partial";
    } else {
      newStatus = "sent";
    }

    await supabase
      .from("invoices")
      .update({
        paid_amount: newPaidAmount,
        paid_date: newPaidAmount >= invoice.amount ? invoice.paid_amount.toString() : null,
        status: newStatus,
      })
      .eq("id", invoiceId);
  }

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  return { success: true };
}
