import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import LeadForm from "@/components/leads/LeadForm";
import { updateLead } from "@/app/(dashboard)/leads/actions";
import type { Lead } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) notFound();

  const typedLead = lead as Lead;

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateLead(id, formData);
  }

  return (
    <>
      <PageHeader title={`Edit: ${typedLead.name}`} description="Update lead information" backHref={`/leads/${id}`} />
      <LeadForm lead={typedLead} action={handleUpdate} submitLabel="Save Changes" />
    </>
  );
}
