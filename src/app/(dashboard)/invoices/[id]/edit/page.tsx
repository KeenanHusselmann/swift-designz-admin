import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { updateInvoiceAction } from "@/app/(dashboard)/invoices/actions";
import type { Client, Project, InvoiceItem } from "@/types/database";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: invoice },
    { data: items },
    { data: clients },
    { data: projects },
  ] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).single(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("sort_order"),
    supabase.from("clients").select("id, name, email, phone, company, location, notes, lead_id, created_at, updated_at").order("name"),
    supabase.from("projects").select("*").order("name"),
  ]);

  if (!invoice) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateInvoiceAction(id, formData);
  }

  return (
    <>
      <PageHeader
        title="Edit Invoice"
        description={invoice.invoice_number}
        backHref={`/invoices/${id}`}
      />
      <div className="max-w-2xl">
        <InvoiceForm
          invoice={invoice}
          existingItems={(items || []) as InvoiceItem[]}
          clients={(clients || []) as Client[]}
          projects={(projects || []) as Project[]}
          action={action}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
