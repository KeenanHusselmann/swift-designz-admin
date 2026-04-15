import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import DeleteEquipmentButton from "@/components/equipment/DeleteEquipmentButton";
import { updateEquipmentAction, deleteEquipmentAction } from "../../actions";
import { notFound } from "next/navigation";
import type { Equipment } from "@/types/database";

interface EditEquipmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("equipment").select("*").eq("id", id).single();
  if (!data) notFound();

  const equipment = data as Equipment;

  const updateAction = updateEquipmentAction.bind(null, id);
  const deleteAction = async () => {
    "use server";
    await deleteEquipmentAction(id);
  };

  return (
    <>
      <PageHeader
        title="Edit Equipment"
        description={equipment.name}
        backHref="/equipment"
      />
      <div className="max-w-2xl space-y-4">
        <EquipmentForm equipment={equipment} action={updateAction} submitLabel="Save Changes" />
        <DeleteEquipmentButton name={equipment.name} action={deleteAction} />
      </div>
    </>
  );
}
