import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import InvestorForm from "@/components/investors/InvestorForm";
import { updateInvestorAction } from "../../actions";
import type { Investor } from "@/types/database";

export default async function EditInvestorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("investors").select("*").eq("id", id).single();
  const investor = data as Investor | null;
  if (!investor) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateInvestorAction(id, formData);
  }

  return (
    <>
      <PageHeader title="Edit Investor" description={investor.name} backHref={`/investors/${id}`} />
      <InvestorForm investor={investor} action={action} submitLabel="Update Investor" />
    </>
  );
}
