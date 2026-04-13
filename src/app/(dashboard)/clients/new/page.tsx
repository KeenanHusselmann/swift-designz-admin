import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ClientForm from "@/components/clients/ClientForm";
import { createClientAction } from "@/app/(dashboard)/clients/actions";

export default async function NewClientPage() {
  // Pre-fetch to warm the connection (no data needed)
  await createClient();

  return (
    <>
      <PageHeader title="New Client" description="Add a new client to your directory" />
      <div className="max-w-3xl">
        <ClientForm action={createClientAction} submitLabel="Create Client" />
      </div>
    </>
  );
}
