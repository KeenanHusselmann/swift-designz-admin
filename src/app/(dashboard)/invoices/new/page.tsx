import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { createInvoiceAction } from "@/app/(dashboard)/invoices/actions";
import type { Client, Project } from "@/types/database";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; project_id?: string }>;
}) {
  const { client_id, project_id } = await searchParams;
  const supabase = await createClient();

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("id, name, email, phone, company, location, notes, lead_id, created_at, updated_at").order("name"),
    supabase.from("projects").select("id, client_id, name, service, package, status, start_date, due_date, quoted_amount, notes, created_at, updated_at").order("name"),
  ]);

  return (
    <>
      <PageHeader title="New Invoice" description="Create an itemized invoice" />
      <div className="max-w-3xl">
        <InvoiceForm
          clients={(clients || []) as Client[]}
          projects={(projects || []) as Project[]}
          preselectedClientId={client_id}
          preselectedProjectId={project_id}
          action={createInvoiceAction}
          submitLabel="Create Invoice"
        />
      </div>
    </>
  );
}
