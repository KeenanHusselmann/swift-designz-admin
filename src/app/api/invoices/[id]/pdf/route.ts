import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoices/InvoicePDF";
import type { InvoiceItem } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: invoice }, { data: items }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, clients(name, email, phone, company)")
      .eq("id", id)
      .single(),
    supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("sort_order"),
  ]);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const client = invoice.clients as { name: string; email: string; phone: string | null; company: string | null } | null;
  const typedItems = (items || []) as InvoiceItem[];

  const buffer = await renderToBuffer(
    InvoicePDF({
      invoiceNumber: invoice.invoice_number,
      status: invoice.status,
      dueDate: invoice.due_date,
      createdAt: invoice.created_at,
      clientName: client?.name || "Unknown",
      clientEmail: client?.email || "",
      clientCompany: client?.company,
      clientPhone: client?.phone,
      items: typedItems.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unit_rate: i.unit_rate,
        amount: i.amount,
      })),
      total: invoice.amount,
      paidAmount: invoice.paid_amount,
      notes: invoice.notes,
    }),
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
