import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import IncomeForm from "@/components/accounting/IncomeForm";
import { updateIncomeAction } from "../../actions";
import type { IncomeEntry } from "@/types/database";

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("income_entries").select("*").eq("id", id).single();
  if (!data) notFound();

  const entry = data as IncomeEntry;

  async function action(formData: FormData) {
    "use server";
    return updateIncomeAction(id, formData);
  }

  return (
    <>
      <PageHeader title="Edit Income" description={entry.description} backHref="/accounting/income" />
      <div className="max-w-2xl">
        <IncomeForm entry={entry} action={action} submitLabel="Save Changes" />
      </div>
    </>
  );
}
