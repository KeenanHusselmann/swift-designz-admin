import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import { updateLiabilityAction } from "../../actions";
import LiabilityForm from "@/components/accounting/LiabilityForm";
import { notFound } from "next/navigation";
import type { Liability } from "@/types/database";

export default async function EditLiabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("liabilities").select("*").eq("id", id).single();
  if (!data) notFound();
  const liability = data as Liability;

  const action = updateLiabilityAction.bind(null, id);

  return (
    <>
      <PageHeader
        title="Edit Liability"
        description={liability.name}
        backHref="/accounting/liabilities"
      />
      <div className="max-w-2xl">
        <div className="glass-card p-6">
          <LiabilityForm action={action} defaultValues={liability} />
        </div>
      </div>
    </>
  );
}
