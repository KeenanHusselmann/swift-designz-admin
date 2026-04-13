import PageHeader from "@/components/ui/PageHeader";
import IncomeForm from "@/components/accounting/IncomeForm";
import { createIncomeAction } from "../actions";

export default function NewIncomePage() {
  return (
    <>
      <PageHeader title="Add Income" description="Record a new income entry" backHref="/accounting/income" />
      <div className="max-w-2xl">
        <IncomeForm action={createIncomeAction} submitLabel="Add Income" />
      </div>
    </>
  );
}
