import PageHeader from "@/components/ui/PageHeader";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { createEquipmentAction } from "../actions";

export default function NewEquipmentPage() {
  return (
    <>
      <PageHeader
        title="Add Equipment"
        description="Register a new asset or piece of equipment"
        backHref="/equipment"
      />
      <div className="max-w-2xl">
        <EquipmentForm action={createEquipmentAction} submitLabel="Add Equipment" />
      </div>
    </>
  );
}
