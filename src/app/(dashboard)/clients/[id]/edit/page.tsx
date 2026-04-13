import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ClientForm from "@/components/clients/ClientForm";
import { updateClientAction } from "@/app/(dashboard)/clients/actions";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const action = async (formData: FormData) => {
    "use server";
    return updateClientAction(id, formData);
  };

  return (
    <>
      <PageHeader title="Edit Client" description={client.name} />
      <div className="max-w-3xl">
        <ClientForm client={client} action={action} submitLabel="Save Changes" />
      </div>
    </>
  );
}
