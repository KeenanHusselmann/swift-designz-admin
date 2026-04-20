import PageHeader from "@/components/ui/PageHeader";
import { createLiabilityAction } from "../actions";
import LiabilityForm from "@/components/accounting/LiabilityForm";

export default function NewLiabilityPage() {
  return (
    <>
      <PageHeader
        title="Add Liability"
        description="Record a new loan, credit facility, or amount owed"
        backHref="/accounting/liabilities"
      />
      <div className="max-w-2xl">
        <div className="glass-card p-6">
          <LiabilityForm action={createLiabilityAction} />
        </div>
      </div>
    </>
  );
}
