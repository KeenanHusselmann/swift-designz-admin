import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { createInvoiceAction } from "@/app/(dashboard)/invoices/actions";
import type { Client, Project } from "@/types/database";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; project_id?: string; type?: string }>;
}) {
  const { client_id, project_id, type } = await searchParams;
  const supabase = await createClient();

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("id, name, email, phone, company, location, notes, lead_id, created_at, updated_at").order("name"),
    supabase.from("projects").select("id, client_id, name, service, package, status, start_date, due_date, quoted_amount, notes, created_at, updated_at").order("name"),
  ]);

  const isQuotation = type === "quotation";

  return (
    <>
      <PageHeader
        title={isQuotation ? "New Quotation" : "New Invoice"}
        description={isQuotation ? "Create a quotation for a client" : "Create an itemized invoice"}
        backHref="/invoices"
      />
      <div className="max-w-3xl">
        <InvoiceForm
          clients={(clients || []) as Client[]}
          projects={(projects || []) as Project[]}
          preselectedClientId={client_id}
          preselectedProjectId={project_id}
          preselectedDocType={isQuotation ? "quotation" : "invoice"}
          action={createInvoiceAction}
          submitLabel={isQuotation ? "Create Quotation" : "Create Invoice"}
        />
      </div>
    </>
  );
}
